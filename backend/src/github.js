const { App } = require('@octokit/app');

if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
  console.warn("WARNING: GITHUB_APP_ID or GITHUB_PRIVATE_KEY is missing.");
}

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  // Handle newlines in the private key from .env file
  privateKey: process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
});

/**
 * Get an authenticated Octokit instance for a specific installation
 * @param {number} installationId 
 */
async function getOctokit(installationId) {
  return await app.getInstallationOctokit(installationId);
}

/**
 * Fetch the diff (changed files and lines) for a pull request
 * @param {object} octokit 
 * @param {string} owner 
 * @param {string} repo 
 * @param {number} pull_number 
 */
async function getPRDiff(octokit, owner, repo, pull_number) {
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
    owner,
    repo,
    pull_number,
  });
  
  return response.data.map(file => {
    return `File: ${file.filename}\nStatus: ${file.status}\nChanges:\n${file.patch}\n---\n`;
  }).join('\n');
}

/**
 * Post a summary comment and inline comments to the PR
 * @param {object} octokit 
 * @param {string} owner 
 * @param {string} repo 
 * @param {number} pull_number 
 * @param {string} commit_id - The latest commit SHA on the PR
 * @param {object} reviewData - The structured review from Gemini
 */
async function postReviewComments(octokit, owner, repo, pull_number, commit_id, reviewData) {
  if (reviewData.summary) {
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner,
      repo,
      issue_number: pull_number,
      body: `### AI Code Review Summary\n**Verdict:** ${reviewData.verdict}\n\n${reviewData.summary}`
    });
  }

  const validComments = [];
  if (reviewData.issues && Array.isArray(reviewData.issues)) {
    for (const issue of reviewData.issues) {
      if (issue.file && issue.line && issue.message) {
        validComments.push({
          path: issue.file,
          line: issue.line,
          body: `**[${issue.severity.toUpperCase()}]** ${issue.message}`
        });
      }
    }
  }

  if (validComments.length > 0) {
    let event = 'COMMENT';
    if (reviewData.verdict === 'APPROVE') event = 'APPROVE';
    if (reviewData.verdict === 'REQUEST_CHANGES') event = 'REQUEST_CHANGES';

    try {
      await octokit.request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
        owner,
        repo,
        pull_number,
        commit_id,
        event,
        comments
      });
    } catch (err) {
      console.error("Failed to post inline PR review. Falling back to simple comment.", err.message);
      // Fallback: just post a normal comment if inline fails (e.g. if lines are out of bounds)
      await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        owner,
        repo,
        issue_number: pull_number,
        body: `*Notice: Some inline comments could not be posted.*`
      });
    }
  }
}

module.exports = {
  app,
  getOctokit,
  getPRDiff,
  postReviewComments
};
