### PR Review Agent
> An autonomous AI agent that reviews GitHub Pull Requests using Gemini 2.5 Flash. When a PR is opened, the agent analyzes the diff, posts inline code comments, and logs every review to a dashboard.

## 1. Features
* Automatically reviews new Pull Requests in your GitHub repository.
* Posts an overall summary as a PR comment.
* Posts specific, line-by-line inline code comments for bugs, security risks, bad practices, and performance issues.
* Live dashboard showing all historical reviews, categorized by severity (Critical, Warning, Suggestion).
* Auto-refreshing UI to see reviews as they come in.

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
* Integrate Slack webhooks for team-wide critical issue notifications (Email alerts are currently implemented)
* Weekly digest report of most common issues across all PRs
* Fine-tuned model on company-specific coding standards

## 7. Enterprise Architecture & Known Limitations

**1. Third-Party AI Data Privacy**
For this portfolio project, the backend is integrated with the public Google Gemini API. In a true enterprise environment, sending proprietary corporate code to a public consumer LLM is a strict security violation. 
* *Enterprise Fix:* To deploy this for an enterprise, the public Gemini API endpoint would be swapped for a Zero-Retention Enterprise API (like Azure OpenAI or Google Cloud Vertex AI) or an on-premise open-source model (like Llama 3) to guarantee strict SOC2 and data privacy compliance.

**2. Email Delivery Sandbox**
The critical alert email system utilizes the Resend API. To comply with strict anti-spam laws, modern email providers require verified custom domains with configured DNS records (SPF, DKIM, DMARC) to send emails to arbitrary users. 
* *Enterprise Fix:* Because this project operates without a paid custom domain, the Resend API runs in "Sandbox Mode", strictly limiting outbound alerts to the verified developer email address. In a production environment, this limitation is resolved purely through DNS infrastructure configuration, requiring zero code changes.
