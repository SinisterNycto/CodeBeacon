<div align="center">
  <h1>CodeBeacon</h1>
  <p><strong>Autonomous Event-Driven AI Code Reviewer</strong></p>
  <a href="https://code-beacon.vercel.app">Live Demo</a> • <a href="https://github.com/apps/codebeacon-by-swastik">Install GitHub App</a>
</div>

<br />

CodeBeacon is a production-grade, event-driven autonomous AI agent that reviews GitHub Pull Requests in real-time. Powered by **Google Gemini 2.5 Flash**, it intercepts Webhooks via a custom Node.js backend, analyzes code diffs for security risks and anti-patterns, and posts line-by-line inline comments directly into GitHub CI pipelines. 

## Key Features

- **Event-Driven Architecture:** Listens for `pull_request.opened` webhooks in the background and responds instantly to prevent timeout blocks.
- **Semantic AI Analysis:** Streams PR diff chunks to Gemini 2.5 Flash for deep context-aware code review.
- **Inline GitHub Feedback:** Posts precise, line-by-line inline comments on the exact files and lines where issues occur.
- **Multi-Tenant Dashboard:** A fully isolated Next.js frontend where users can track historical reviews, categorized by severity (Critical, Warning, Suggestion).
- **Secure Auth & Routing:** Uses Clerk for seamless OAuth login and PostgreSQL (via Prisma) for strict row-level data isolation.
- **Real-time Email Alerts:** Instantly routes Critical Security alerts to a custom email address configured by the PR author.

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend UI** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Backend API** | Node.js, Express.js, Webhooks, Nodemailer |
| **Authentication** | Clerk Auth (Google & GitHub OAuth) |
| **AI Engine** | Google Gemini API (`gemini-2.5-flash`) |
| **Database** | PostgreSQL, Prisma ORM |
| **GitHub Integration** | GitHub Apps API, Octokit (`@octokit/app`, `@octokit/rest`) |

## Production Deployment

CodeBeacon is designed for cloud-native deployment:
- **Frontend:** Deployed globally on [Vercel](https://vercel.com).
- **Backend:** Hosted on [Render](https://render.com) as a background web service listening for GitHub Webhooks.
- **Database:** Hosted PostgreSQL instance (e.g. Supabase, Neon).

## Local Setup & Development

### 1. Environment Variables
Create a `.env` file in both the `/backend` and `/frontend` directories.

**Backend `.env`**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/codebeacon"

# GitHub App Credentials
APP_ID="your_github_app_id"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
WEBHOOK_SECRET="your_custom_webhook_secret"

# Gemini AI
GEMINI_API_KEY="your_google_gemini_key"

# Email Alerts
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
```

**Frontend `.env.local`**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_GITHUB_APP_URL="https://github.com/apps/codebeacon-by-swastik"
```

### 2. Run the Application

```bash
# Terminal 1: Start the Backend Webhook Listener
cd backend
npm install
npm run dev

# Terminal 2: Start the Next.js Dashboard
cd frontend
npm install
npm run dev
```

### 3. Testing Webhooks Locally
To test GitHub Webhooks locally, use [ngrok](https://ngrok.com/) to expose your `localhost:3001` port:
```bash
ngrok http 3001
```
Then paste the generated Ngrok URL into your GitHub App's Webhook settings (e.g., `https://<ngrok-url>.ngrok-free.app/api/webhook`).

## Future Roadmap
* Redis job queue for handling high webhook volume without blocking.
* Fine-tuned model on company-specific coding standards.
* Weekly digest report of most common issues across all PRs.
