require('dotenv').config();
require('express-async-errors');
const express = require('express');
const { handleWebhook } = require('./webhook');
const { prisma } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to capture raw body for HMAC verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// CORS middleware for frontend dashboard
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// GitHub Webhook Route
app.post('/api/webhook', handleWebhook);

// API Route for the Dashboard to fetch reviews
app.get('/api/reviews', async (req, res) => {
  const { author } = req.query;
  if (!author) return res.json([]);

  const reviews = await prisma.review.findMany({
    where: { prAuthor: { equals: author, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
    include: { issues: true },
    take: 50
  });
  
  res.json(reviews);
});

// API Route for Dashboard stats
app.get('/api/stats', async (req, res) => {
  const { author } = req.query;
  if (!author) {
    return res.json({ totalReviews: 0, totalIssues: 0, critical: 0, warning: 0, suggestion: 0 });
  }

  const reviewWhere = { prAuthor: { equals: author, mode: 'insensitive' } };

  const totalReviews = await prisma.review.count({ where: reviewWhere });
  const totalIssues = await prisma.issue.count({ where: { review: reviewWhere } });
  
  const critical = await prisma.issue.count({ where: { severity: 'critical', review: reviewWhere } });
  const warning = await prisma.issue.count({ where: { severity: 'warning', review: reviewWhere } });
  const suggestion = await prisma.issue.count({ where: { severity: 'suggestion', review: reviewWhere } });

  res.json({
    totalReviews,
    totalIssues,
    critical,
    warning,
    suggestion
  });
});

// API Route to save user preferences
app.post('/api/users', async (req, res) => {
  const { clerkId, githubUsername, alertEmail } = req.body;
  if (!clerkId || !githubUsername || !alertEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: { githubUsername, alertEmail },
    create: { clerkId, githubUsername, alertEmail }
  });

  res.json(user);
});

// API Route to fetch user preferences
app.get('/api/users/:clerkId', async (req, res) => {
  const { clerkId } = req.params;
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Basic healthcheck
app.get('/', async (req, res) => {
  try {
    // Ping the database to keep Neon from scaling to zero
    await prisma.$queryRaw`SELECT 1`;
    res.send('PR Review Agent Backend is running and DB is warm');
  } catch (error) {
    console.error("Healthcheck DB ping failed:", error);
    res.status(500).send('Backend is running, but DB ping failed');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
