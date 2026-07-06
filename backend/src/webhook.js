const crypto = require('crypto');
const { getOctokit, getPRDiff, postReviewComments } = require('./github');
const { reviewPRDiff } = require('./reviewer');
const { prisma } = require('./db');
const { sendAlertEmail } = require('./mailer');

/**
 * Verify GitHub webhook signature using HMAC-SHA256
 */
function verifyGitHubSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("WARNING: GITHUB_WEBHOOK_SECRET is not set. Signature verification will fail.");
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  // req.rawBody must be populated by express middleware
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch (e) {
    return false;
  }
}

/**
 * Handle incoming webhooks from GitHub
 */
async function handleWebhook(req, res) {
  const event = req.headers['x-github-event'];
  
  if (!verifyGitHubSignature(req)) {
    console.error("Webhook signature verification failed.");
    return res.status(401).send('Unauthorized: Invalid signature');
  }

  if (event === 'pull_request') {
    const action = req.body.action;
    if (action === 'opened' || action === 'synchronize') {
      const pr = req.body.pull_request;
      const repo = req.body.repository;
      const installationId = req.body.installation?.id;

      if (!installationId) {
        console.error("No installation ID provided in webhook payload.");
        return res.status(400).send("No installation ID");
      }

      res.status(200).send('Webhook received, processing review asynchronously.');

      processReview(installationId, repo.owner.login, repo.name, pr.number, pr.title, pr.user.login, pr.head.sha)
        .catch(err => console.error("Error processing review asynchronously:", err));
      
      return;
    }
  }

  res.status(200).send('Event ignored.');
}

/**
 * Background task to review PR, post comments, and save to DB
 */
async function processReview(installationId, owner, repoName, prNumber, prTitle, prAuthor, commitSha) {
  console.log(`Starting review for ${owner}/${repoName}#${prNumber}...`);
  
  try {
    const octokit = await getOctokit(installationId);
    
    const diff = await getPRDiff(octokit, owner, repoName, prNumber);
    if (!diff.trim()) {
      console.log(`No diff found for ${owner}/${repoName}#${prNumber}. Skipping review.`);
      return;
    }
    
    const reviewResult = await reviewPRDiff(diff);
    
    await postReviewComments(octokit, owner, repoName, prNumber, commitSha, reviewResult);
    
    const issueCount = Array.isArray(reviewResult.issues) ? reviewResult.issues.length : 0;
    
    const savedReview = await prisma.review.create({
      data: {
        repoName: `${owner}/${repoName}`,
        prNumber,
        prTitle,
        prAuthor,
        verdict: reviewResult.verdict,
        summary: reviewResult.summary,
        issueCount,
        issues: {
          create: Array.isArray(reviewResult.issues) ? reviewResult.issues.map(i => ({
            file: i.file || 'unknown',
            line: i.line || 0,
            severity: i.severity || 'suggestion',
            message: i.message || 'No message provided'
          })) : []
        }
      }
    });

    console.log(`Review saved to DB with ID: ${savedReview.id}`);

    // Check for critical alerts
    let hasCritical = false;
    if (Array.isArray(reviewResult.issues)) {
      hasCritical = reviewResult.issues.some(i => i.severity && i.severity.toLowerCase() === 'critical');
    }

    if (reviewResult.verdict === 'REQUEST_CHANGES' || hasCritical) {
      const subject = `🚨 CRITICAL ALERT: PR #${prNumber} in ${owner}/${repoName}`;
      const text = `A recent Pull Request requires immediate attention.\\n\\nRepository: ${owner}/${repoName}\\nPR Number: ${prNumber}\\nAuthor: ${prAuthor}\\nVerdict: ${reviewResult.verdict}\\nSummary: ${reviewResult.summary}\\nCritical Issues Found: ${hasCritical ? 'Yes' : 'No'}`;
      const html = `
        <h2>🚨 Pull Request Alert</h2>
        <p>A recent Pull Request requires immediate attention.</p>
        <ul>
          <li><b>Repository:</b> ${owner}/${repoName}</li>
          <li><b>PR Number:</b> #${prNumber}</li>
          <li><b>Author:</b> ${prAuthor}</li>
          <li><b>Verdict:</b> <span style="color:red">${reviewResult.verdict}</span></li>
        </ul>
        <p><b>Summary:</b> ${reviewResult.summary}</p>
        <p><b>Critical Issues Found:</b> ${hasCritical ? 'Yes' : 'No'}</p>
      `;
      
      // Lookup user preference from database
      try {
        const users = await prisma.user.findMany({ 
          where: { 
            githubUsername: { 
              equals: prAuthor, 
              mode: 'insensitive' 
            } 
          } 
        });
        
        if (users.length > 0) {
          for (const user of users) {
            if (user.alertEmail) {
              console.log(`Routing alert to custom email ${user.alertEmail} for PR author ${prAuthor}`);
              sendAlertEmail(subject, text, html, user.alertEmail).catch(console.error);
            }
          }
        } else {
          // Fallback if no user found
          const debugHtml = html + `<br><hr><p><small><b>DEBUG INFO:</b> Database lookup for PR Author '<b>${prAuthor}</b>' returned 0 results. Falling back to default admin email.</small></p>`;
          sendAlertEmail(subject, text, debugHtml, null).catch(console.error);
        }
      } catch (err) {
        console.error("Error looking up custom alert emails:", err);
        // Fallback on error
        const debugHtml = html + `<br><hr><p><small><b>DEBUG INFO:</b> Prisma Database query CRASHED (check Render logs). Falling back to default admin email.</small></p>`;
        sendAlertEmail(subject, text, debugHtml, null).catch(console.error);
      }
    }
  } catch (error) {
    console.error("Critical error in processReview:", error);
  }
}

module.exports = { handleWebhook };
