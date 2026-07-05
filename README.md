# CodeBeacon
> An autonomous AI agent that reviews GitHub Pull Requests using Gemini 2.5 Flash. When a PR is opened, the agent analyzes the diff, posts inline code comments, and logs every review to a dashboard.

## 1. Features
* Automatically reviews new Pull Requests in your GitHub repository.
* Posts an overall summary as a PR comment.
* Posts specific, line-by-line inline code comments for bugs, security risks, bad practices, and performance issues.
* **Multi-Tenant Dashboard**: Live dashboard showing historical reviews, categorized by severity (Critical, Warning, Suggestion).
* **Clerk Authentication**: Secure user login and personalized settings.
* **Dynamic Email Alerts**: Instantly routes critical security alerts to a custom email address configured by the user.

## 2. Architecture
The application follows a robust 3-layer architecture. A Node.js backend acts as a GitHub App webhook receiver, securely processing payloads. It communicates with the Gemini API to analyze the PR diff and stores the results in a PostgreSQL database via Prisma. Finally, a separate Next.js frontend dashboard fetches and visualizes these reviews in real-time.

## 3. Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, `express-async-errors` |
| **AI** | Google Gemini API (`gemini-2.5-flash`), `@google/generative-ai` |
| **Database** | PostgreSQL, Prisma ORM |
| **GitHub Integration** | GitHub Apps API, Octokit (`@octokit/app`, `@octokit/rest`) |
| **Deployment** | Docker, Docker Compose, GitHub Actions |

## 4. Setup & Running locally

### Prerequisites
* Node.js v18+ (if running manually)
* Docker and Docker Compose (if running via Docker container)

### Steps
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-dir>
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and fill in your Gemini API Key, GitHub App credentials, etc.
   ```

3. Run the application:

**Option A: Using Docker (Recommended)**
   ```bash
   docker-compose up --build
   ```

**Option B: Running Manually (Without Docker)**
   Requires Node.js v18+ installed.
   ```bash
   # Terminal 1: Start Backend
   cd backend
   npm install
   npm run dev

   # Terminal 2: Start Frontend
   cd frontend
   npm install
   npm run dev
   ```

4. The backend will be available at `http://localhost:3001` and the frontend dashboard at `http://localhost:3000`. Set your GitHub App's webhook URL to `http://your-ngrok-url/api/webhook`.

## 5. How it works
1. **PR opened:** A developer opens a Pull Request on a repository where the GitHub App is installed.
2. **Webhook fires:** GitHub sends a `pull_request` event payload to the Node.js backend. The backend immediately responds with HTTP 200 to prevent timeouts.
3. **Gemini reviews:** The backend fetches the PR diff via Octokit and sends it to the Gemini API, asking for a structured JSON code review.
4. **Comments posted + dashboard updated:** The backend uses Octokit to post the summary and inline comments back to the PR on GitHub, and then saves the review to the PostgreSQL database which updates the Next.js dashboard.

## 6. Future Improvements
* Redis job queue for handling high webhook volume without blocking
* Weekly digest report of most common issues across all PRs
* Fine-tuned model on company-specific coding standards
