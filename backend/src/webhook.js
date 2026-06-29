const crypto = require('crypto');
const { getOctokit, getPRDiff, postReviewComments } = require('./github');
const { reviewPRDiff } = require('./reviewer');
const { prisma } = require('./db');

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
  
  // Verify signature
  if (!verifyGitHubSignature(req)) {
    console.error("Webhook signature verification failed.");
    return res.status(401).send('Unauthorized: Invalid signature');
  }

  // We only care about pull requests being opened or synchronized (new commits)
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

      // 1. Immediately return HTTP 200 to GitHub to prevent timeout
      res.status(200).send('Webhook received, processing review asynchronously.');

      // 2. Process the AI review asynchronously
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
    
    // Fetch Diff
    const diff = await getPRDiff(octokit, owner, repoName, prNumber);
    if (!diff.trim()) {
      console.log(`No diff found for ${owner}/${repoName}#${prNumber}. Skipping review.`);
      return;
    }
    
    // Call Gemini
    const reviewResult = await reviewPRDiff(diff);
    
    // Post Comments to GitHub
    await postReviewComments(octokit, owner, repoName, prNumber, commitSha, reviewResult);
    
    // Save to Database
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
  } catch (error) {
    console.error("Critical error in processReview:", error);
  }
}

module.exports = { handleWebhook };
