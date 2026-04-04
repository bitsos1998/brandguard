-- BrandGuard database schema

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  business_name TEXT,
  sector TEXT,
  city TEXT,
  website TEXT,
  contact_email TEXT,
  contact_name TEXT,
  source TEXT,                    -- 'inbound' or 'outreach'
  trademark_status TEXT DEFAULT 'unknown',  -- 'unknown', 'unprotected', 'protected', 'skip'
  trademark_notes TEXT,
  risk_level TEXT,                -- 'high', 'medium', 'low'
  outreach_status TEXT DEFAULT 'pending',  -- 'pending', 'sent', 'replied', 'converted', 'dead'
  outreach_sent_at TIMESTAMP,
  last_reply_at TIMESTAMP,
  paid_product TEXT,
  revenue NUMERIC,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outreach_emails (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  subject TEXT,
  body TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  opened BOOLEAN DEFAULT FALSE,
  replied BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS research_batches (
  id SERIAL PRIMARY KEY,
  sector TEXT,
  city TEXT,
  total_found INTEGER,
  unprotected_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);
