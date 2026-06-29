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
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { issues: true },
    take: 50
  });
  
  res.json(reviews);
});

// API Route for Dashboard stats
app.get('/api/stats', async (req, res) => {
  const totalReviews = await prisma.review.count();
  const totalIssues = await prisma.issue.count();
  
  const critical = await prisma.issue.count({ where: { severity: 'critical' } });
  const warning = await prisma.issue.count({ where: { severity: 'warning' } });
  const suggestion = await prisma.issue.count({ where: { severity: 'suggestion' } });

  res.json({
    totalReviews,
    totalIssues,
    critical,
    warning,
    suggestion
  });
});

// Basic healthcheck
app.get('/', (req, res) => {
  res.send('PR Review Agent Backend is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
