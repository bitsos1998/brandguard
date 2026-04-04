require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

// Stripe webhook must use raw body — register BEFORE express.json()
const stripeRoutes = require('./routes/stripe');
app.use('/webhook', stripeRoutes);
app.use('/create-checkout', stripeRoutes);
app.use('/payment-success', stripeRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── ADMIN AUTH MIDDLEWARE ─────────────────────────────────────────────────────
const adminAuth = require('./middleware/adminAuth');
const adminRoutes = require('./routes/admin');

// Apply auth middleware to all /admin routes
app.use('/admin', (req, res, next) => {
  // Allow login page without auth
  if (req.path === '/login' || req.path === '/logout') return next();
  adminAuth(req, res, next);
}, adminRoutes);

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────────────────
const publicRoutes = require('./routes/public');
app.use('/', publicRoutes);

// ─── DATABASE INIT ─────────────────────────────────────────────────────────────
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        business_name TEXT,
        sector TEXT,
        city TEXT,
        website TEXT,
        contact_email TEXT,
        contact_name TEXT,
        source TEXT,
        trademark_status TEXT DEFAULT 'unknown',
        trademark_notes TEXT,
        risk_level TEXT,
        outreach_status TEXT DEFAULT 'pending',
        outreach_sent_at TIMESTAMP,
        last_reply_at TIMESTAMP,
        paid_product TEXT,
        revenue NUMERIC,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS outreach_emails (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES leads(id),
        subject TEXT,
        body TEXT,
        generated_at TIMESTAMP DEFAULT NOW(),
        sent_at TIMESTAMP,
        opened BOOLEAN DEFAULT FALSE,
        replied BOOLEAN DEFAULT FALSE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS research_batches (
        id SERIAL PRIMARY KEY,
        sector TEXT,
        city TEXT,
        total_found INTEGER,
        unprotected_count INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        notes TEXT
      )
    `);

    console.log('Database tables initialised successfully');
  } catch (err) {
    console.error('Error initialising database tables:', err.message);
    // Don't crash — tables may already exist or DB may not be connected yet
  }
}

// ─── START SERVER ──────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`BrandGuard server running on port ${PORT}`);
  await initDB();
});

module.exports = app;
