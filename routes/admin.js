const express = require('express');
const router = express.Router();
const pool = require('../db');
const Anthropic = require('@anthropic-ai/sdk');
const { sendOutreachMarkedSent } = require('../email');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const { searchPlaces } = require('../lib/placesApi');
const { scrapeContactEmail } = require('../lib/emailScraper');
const { sendOutreach, runFollowUpSequence } = require('../lib/outreach');

// Admin login page
router.get('/login', (req, res) => {
  res.send(loginHTML(''));
});

// Handle admin login POST
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.cookie('admin_session', password, { httpOnly: true, maxAge: 86400000 * 7 }); // 7 days
    res.redirect('/admin/leads');
  } else {
    res.send(loginHTML('Λάθος κωδικός.'));
  }
});

// Admin logout
router.get('/logout', (req, res) => {
  res.clearCookie('admin_session');
  res.redirect('/admin/login');
});

// Admin dashboard redirect
router.get('/', (req, res) => {
  res.redirect('/admin/leads');
});

// ─── LEADS DASHBOARD ──────────────────────────────────────────────────────────

router.get('/leads', async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    let query = 'SELECT * FROM leads';
    const params = [];

    if (filter !== 'all') {
      query += ' WHERE outreach_status = $1';
      params.push(filter);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    const leads = result.rows;

    // Stats
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE outreach_status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE outreach_status = 'sent') AS sent,
        COUNT(*) FILTER (WHERE outreach_status = 'replied') AS replied,
        COUNT(*) FILTER (WHERE outreach_status = 'converted') AS converted,
        COALESCE(SUM(revenue), 0) AS total_revenue
      FROM leads
    `);
    const stats = statsResult.rows[0];

    res.send(leadsHTML(leads, stats, filter));
  } catch (err) {
    console.error('Error fetching leads:', err.message);
    res.status(500).send('Error loading leads: ' + err.message);
  }
});

// CSV export
router.get('/leads/export', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    const leads = result.rows;

    const headers = [
      'id','business_name','sector','city','website','contact_email','contact_name',
      'source','trademark_status','trademark_notes','risk_level','outreach_status',
      'outreach_sent_at','last_reply_at','paid_product','revenue','notes','created_at'
    ];

    const csvRows = [headers.join(',')];
    for (const lead of leads) {
      const row = headers.map(h => {
        const val = lead[h] === null || lead[h] === undefined ? '' : String(lead[h]);
        return '"' + val.replace(/"/g, '""') + '"';
      });
      csvRows.push(row.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="brandguard_leads.csv"');
    res.send(csvRows.join('\n'));
  } catch (err) {
    console.error('Error exporting CSV:', err.message);
    res.status(500).send('Error exporting CSV');
  }
});

// Update lead field (AJAX)
router.post('/leads/:id/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    const allowedFields = [
      'trademark_status', 'risk_level', 'outreach_status', 'notes',
      'trademark_notes', 'last_reply_at', 'revenue'
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: 'Field not allowed' });
    }

    await pool.query(
      `UPDATE leads SET ${field} = $1 WHERE id = $2`,
      [value, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating lead:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Mark as sent (updates outreach_sent_at too)
router.post('/leads/:id/mark-sent', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE leads SET outreach_status = 'sent', outreach_sent_at = NOW() WHERE id = $1`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking lead as sent:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Mark as replied
router.post('/leads/:id/mark-replied', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE leads SET outreach_status = 'replied', last_reply_at = NOW() WHERE id = $1`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking lead as replied:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── RESEARCH TOOL ────────────────────────────────────────────────────────────

router.get('/research', (req, res) => {
  res.send(researchHTML('', []));
});

router.post('/research', async (req, res) => {
  try {
    const { sector, city, business_names } = req.body;

    let businesses = [];
    let dataSource = 'unknown';

    // Prefer real data from Google Places API
    const placesResult = await searchPlaces(sector, city, 20);

    if (placesResult.ok && placesResult.places.length > 0) {
      // REAL businesses from Google Places — now scrape each website for real email
      console.log(`[research] ${placesResult.places.length} real businesses from Places API`);
      dataSource = 'places';

      for (const p of placesResult.places) {
        let scrapedEmail = null;
        let emailSource = null;
        if (p.website) {
          try {
            const scrape = await scrapeContactEmail(p.website);
            scrapedEmail = scrape.email;
            emailSource = scrape.source;
          } catch (err) {
            console.error(`Scrape failed for ${p.website}:`, err.message);
          }
        }

        businesses.push({
          business_name: p.business_name,
          city,
          sector,
          likely_website: p.website,
          contact_email: scrapedEmail,
          phone: p.phone,
          address: p.address,
          google_maps_url: p.google_maps_url,
          email_source: emailSource,
          trademark_risk_reason: '(needs trademark check)',
          risk_level: scrapedEmail ? 'medium' : 'low', // default — refined after TMview check
          data_source: 'places',
        });
      }
    } else {
      // Fallback: Claude generates educated guesses (low quality, use only if Places unavailable)
      console.log(`[research] Places unavailable (${placesResult.reason}) — using Claude fallback`);
      dataSource = 'claude';

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: business_names && business_names.trim()
              ? `Sector: ${sector}, City: ${city}. Business names to enrich: ${business_names.trim()}`
              : `Sector: ${sector}, City: ${city}. Generate 20 Greek businesses.`,
          },
        ],
        system: `You are a business research assistant for BrandGuard, a Greek trademark protection service. Given a sector and city in Greece, generate a realistic list of 20 Greek small businesses that would typically operate in that sector. For each business provide: business_name, city, sector, likely_website (educated guess), contact_email (educated guess based on business name), trademark_risk_reason (one sentence explaining why their specific name might be unprotected and valuable to protect), risk_level (high/medium/low based on how distinctive and valuable the name appears). Return as valid JSON array only, no other text.`,
      });

      businesses = JSON.parse(message.content[0].text.trim());
      for (const b of businesses) b.data_source = 'claude';
    }

    // Save batch record
    await pool.query(
      `INSERT INTO research_batches (sector, city, total_found, notes) VALUES ($1, $2, $3, $4)`,
      [sector, city, businesses.length, `${dataSource} research batch`]
    );

    res.send(researchHTML('', businesses, sector, city, dataSource));
  } catch (err) {
    console.error('Error running research:', err.message);
    res.status(500).send('Error running research: ' + err.message);
  }
});

// Add selected businesses to leads
router.post('/research/add-leads', async (req, res) => {
  try {
    let { businesses } = req.body;
    if (!businesses) return res.redirect('/admin/research');

    if (typeof businesses === 'string') {
      businesses = JSON.parse(businesses);
    }
    if (!Array.isArray(businesses)) {
      businesses = [businesses];
    }

    let added = 0;
    for (const b of businesses) {
      await pool.query(
        `INSERT INTO leads (business_name, sector, city, website, contact_email, phone, address, google_maps_url,
                            trademark_notes, risk_level, source, trademark_status, outreach_status, data_source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'outreach', 'unknown', 'pending', $11)`,
        [b.business_name, b.sector, b.city, b.likely_website, b.contact_email, b.phone || null,
         b.address || null, b.google_maps_url || null, b.trademark_risk_reason, b.risk_level, b.data_source || 'claude']
      );
      added++;
    }

    res.redirect('/admin/leads?added=' + added);
  } catch (err) {
    console.error('Error adding leads:', err.message);
    res.status(500).send('Error adding leads: ' + err.message);
  }
});

// ─── EMAIL GENERATION ─────────────────────────────────────────────────────────

router.post('/generate-email', async (req, res) => {
  try {
    const { lead_id } = req.body;

    const leadResult = await pool.query('SELECT * FROM leads WHERE id = $1', [lead_id]);
    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const lead = leadResult.rows[0];

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are writing outreach emails for BrandGuard, a Greek trademark protection service. The tone is helpful and informative, never threatening or alarming. You are alerting a business owner to a genuine risk they likely don't know about. Write in Greek. Be specific, warm, and professional. Keep it under 180 words. Return a JSON object with fields: subject (string) and body (string).`,
      messages: [
        {
          role: 'user',
          content: `Write an outreach email to ${lead.business_name}, a ${lead.sector || 'business'} in ${lead.city || 'Greece'}. The reason their name may be unprotected: ${lead.trademark_notes || 'their trading name does not appear to have a registered trademark in Greece'}. The email should: acknowledge their business by name, mention that we noticed their trading name doesn't appear to have a registered trademark in Greece, explain that under Greek law (first-to-file rule) anyone can register their name before them, offer a free trademark risk check with no obligation, end with a clear call to action to reply or visit brandguard.gr. Sign off as BrandGuard team.`,
        },
      ],
    });

    const emailData = JSON.parse(message.content[0].text.trim());

    // Save generated email to outreach_emails table
    await pool.query(
      `INSERT INTO outreach_emails (lead_id, subject, body) VALUES ($1, $2, $3)`,
      [lead_id, emailData.subject, emailData.body]
    );

    res.json({ success: true, subject: emailData.subject, body: emailData.body, lead_id });
  } catch (err) {
    console.error('Error generating email:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── HTML TEMPLATES ───────────────────────────────────────────────────────────

function loginHTML(error) {
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>BrandGuard Admin</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f0f2f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 12px; padding: 40px; width: 340px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
    h2 { margin-bottom: 24px; color: #1a1a2e; }
    input { width: 100%; padding: 12px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 15px; margin-bottom: 16px; }
    button { width: 100%; padding: 12px; background: #e94560; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; }
    .error { color: #e94560; font-size: 14px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>BrandGuard Admin</h2>
    ${error ? `<div class="error">${error}</div>` : ''}
    <form method="POST" action="/admin/login">
      <input type="password" name="password" placeholder="Admin password" autofocus required>
      <button type="submit">Σύνδεση</button>
    </form>
  </div>
</body>
</html>`;
}

function leadsHTML(leads, stats, currentFilter) {
  const filters = ['all', 'pending', 'sent', 'replied', 'converted'];
  const filterButtons = filters.map(f =>
    `<a href="/admin/leads?filter=${f}" class="btn-filter ${currentFilter === f ? 'active' : ''}">${f.charAt(0).toUpperCase() + f.slice(1)}</a>`
  ).join('');

  const rows = leads.map(lead => `
    <tr id="row-${lead.id}">
      <td>${lead.id}</td>
      <td><strong>${esc(lead.business_name)}</strong><br><small style="color:#888">${esc(lead.city || '')} · ${esc(lead.sector || '')}</small></td>
      <td>${esc(lead.source || '')}</td>
      <td>
        <select onchange="updateField(${lead.id}, 'trademark_status', this.value)" style="font-size:13px;padding:4px;border-radius:4px;">
          ${['unknown','unprotected','protected','skip'].map(v =>
            `<option value="${v}" ${lead.trademark_status === v ? 'selected' : ''}>${v}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <select onchange="updateField(${lead.id}, 'risk_level', this.value)" style="font-size:13px;padding:4px;border-radius:4px;">
          ${['','high','medium','low'].map(v =>
            `<option value="${v}" ${lead.risk_level === v ? 'selected' : ''}>${v || '-'}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <select onchange="updateField(${lead.id}, 'outreach_status', this.value)" style="font-size:13px;padding:4px;border-radius:4px;">
          ${['pending','sent','replied','converted','dead'].map(v =>
            `<option value="${v}" ${lead.outreach_status === v ? 'selected' : ''}>${v}</option>`
          ).join('')}
        </select>
      </td>
      <td>${lead.revenue ? '€' + lead.revenue : '-'}</td>
      <td style="white-space:nowrap">
        <a href="https://www.tmdn.org/tmview/welcome#!ST=GR&TM=${encodeURIComponent(lead.business_name || '')}" target="_blank" class="btn-action btn-blue">TMview</a>
        <button onclick="generateEmail(${lead.id})" class="btn-action btn-green">Email</button>
        <button onclick="markReplied(${lead.id})" class="btn-action btn-yellow">Replied</button>
      </td>
      <td>
        <input type="text" value="${esc(lead.notes || '')}" placeholder="Notes..."
          onblur="updateField(${lead.id}, 'notes', this.value)"
          style="width:160px;font-size:13px;padding:4px;border:1px solid #ddd;border-radius:4px;">
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>BrandGuard — Leads</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; margin: 0; background: #f0f2f5; }
    nav { background: #1a1a2e; padding: 12px 24px; display: flex; gap: 16px; align-items: center; }
    nav a { color: #aaa; text-decoration: none; font-size: 14px; }
    nav a:hover, nav a.active { color: #fff; }
    nav .logo { color: #fff; font-weight: 700; margin-right: 16px; }
    .container { max-width: 1400px; margin: 24px auto; padding: 0 24px; }
    .stats { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { background: #fff; border-radius: 10px; padding: 16px 24px; flex: 1; min-width: 120px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .stat .n { font-size: 28px; font-weight: 800; color: #1a1a2e; }
    .stat .l { font-size: 13px; color: #888; }
    .toolbar { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; }
    .btn-filter { padding: 8px 16px; border-radius: 8px; background: #fff; color: #555; text-decoration: none; font-size: 14px; border: 1.5px solid #ddd; }
    .btn-filter.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }
    .btn-export { padding: 8px 16px; border-radius: 8px; background: #e94560; color: #fff; text-decoration: none; font-size: 14px; margin-left: auto; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    th { background: #f8f9fa; padding: 12px 10px; text-align: left; font-size: 13px; color: #666; font-weight: 600; border-bottom: 1px solid #eee; }
    td { padding: 12px 10px; font-size: 14px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    .btn-action { padding: 5px 10px; border-radius: 6px; font-size: 12px; border: none; cursor: pointer; color: #fff; text-decoration: none; display: inline-block; margin: 2px; }
    .btn-blue { background: #0d6efd; }
    .btn-green { background: #198754; }
    .btn-yellow { background: #fd7e14; }
    .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center; }
    .modal.show { display:flex; }
    .modal-content { background:#fff; border-radius:12px; padding:32px; max-width:600px; width:90%; max-height:80vh; overflow-y:auto; }
    .modal-content h3 { margin-bottom:12px; }
    .modal-subject { font-weight:700; margin-bottom:12px; color:#333; }
    .modal-body { white-space:pre-wrap; background:#f8f9fa; padding:16px; border-radius:8px; font-size:14px; line-height:1.6; }
    .modal-actions { margin-top:16px; display:flex; gap:8px; }
    .btn-primary { padding:10px 20px; background:#e94560; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:700; }
    .btn-secondary { padding:10px 20px; background:#6c757d; color:#fff; border:none; border-radius:8px; cursor:pointer; }
  </style>
</head>
<body>
<nav>
  <span class="logo">BrandGuard</span>
  <a href="/admin/leads" class="active">Leads</a>
  <a href="/admin/research">Research</a>
  <a href="/admin/logout">Logout</a>
</nav>
<div class="container">
  <div class="stats">
    <div class="stat"><div class="n">${stats.total}</div><div class="l">Total Leads</div></div>
    <div class="stat"><div class="n">${stats.pending}</div><div class="l">Pending</div></div>
    <div class="stat"><div class="n">${stats.sent}</div><div class="l">Sent</div></div>
    <div class="stat"><div class="n">${stats.replied}</div><div class="l">Replied</div></div>
    <div class="stat"><div class="n">${stats.converted}</div><div class="l">Converted</div></div>
    <div class="stat"><div class="n">€${parseFloat(stats.total_revenue).toFixed(0)}</div><div class="l">Revenue</div></div>
  </div>
  <div class="toolbar">
    ${filterButtons}
    <button onclick="sendBatch()" class="btn-export" style="background:#0d6efd;border:none;cursor:pointer;font-family:inherit">⚡ Send All Pending</button>
    <button onclick="runFollowUps()" class="btn-export" style="background:#fd7e14;border:none;cursor:pointer;font-family:inherit">🔁 Follow-ups</button>
    <a href="/admin/leads/export" class="btn-export">Export CSV</a>
    <a href="/admin/research" class="btn-export" style="background:#198754">+ Research</a>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Business</th>
        <th>Source</th>
        <th>TM Status</th>
        <th>Risk</th>
        <th>Outreach</th>
        <th>Revenue</th>
        <th>Actions</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="9" style="text-align:center;color:#888;padding:32px;">No leads yet</td></tr>'}</tbody>
  </table>
</div>

<!-- Email modal -->
<div class="modal" id="emailModal">
  <div class="modal-content">
    <h3>Generated Email</h3>
    <div class="modal-subject" id="emailSubject"></div>
    <div class="modal-body" id="emailBody"></div>
    <div class="modal-actions">
      <button class="btn-primary" onclick="copyEmail()">Copy Email</button>
      <button class="btn-primary" id="markSentBtn" onclick="markSent()">Mark as Sent</button>
      <button class="btn-secondary" onclick="closeModal()">Close</button>
    </div>
  </div>
</div>

<script>
let currentLeadId = null;

async function updateField(id, field, value) {
  try {
    const res = await fetch('/admin/leads/' + id + '/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value })
    });
    if (!res.ok) throw new Error('Update failed');
  } catch(e) {
    alert('Error saving: ' + e.message);
  }
}

async function markReplied(id) {
  try {
    const res = await fetch('/admin/leads/' + id + '/mark-replied', { method: 'POST' });
    if (res.ok) {
      alert('Marked as replied!');
      location.reload();
    }
  } catch(e) {
    alert('Error: ' + e.message);
  }
}

async function generateEmail(leadId) {
  currentLeadId = leadId;
  document.getElementById('emailSubject').textContent = 'Generating...';
  document.getElementById('emailBody').textContent = '';
  document.getElementById('emailModal').classList.add('show');

  try {
    const res = await fetch('/admin/generate-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    document.getElementById('emailSubject').textContent = 'Θέμα: ' + data.subject;
    document.getElementById('emailBody').textContent = data.body;
  } catch(e) {
    document.getElementById('emailBody').textContent = 'Error: ' + e.message;
  }
}

function closeModal() {
  document.getElementById('emailModal').classList.remove('show');
  currentLeadId = null;
}

function copyEmail() {
  const subject = document.getElementById('emailSubject').textContent;
  const body = document.getElementById('emailBody').textContent;
  navigator.clipboard.writeText(subject + '\\n\\n' + body).then(() => alert('Copied to clipboard!'));
}

async function markSent() {
  if (!currentLeadId) return;
  try {
    const res = await fetch('/admin/leads/' + currentLeadId + '/mark-sent', { method: 'POST' });
    if (res.ok) {
      closeModal();
      location.reload();
    }
  } catch(e) {
    alert('Error: ' + e.message);
  }
}

async function sendBatch() {
  if (!confirm('Send outreach emails to ALL pending leads with a contact email?\\n\\nEmails go out via SendGrid. Each includes a GDPR unsubscribe link. Max 200 at once.')) return;
  try {
    const res = await fetch('/admin/send-batch', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ limit: 200 })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    alert('Done. Sent: ' + data.sent + ', Failed: ' + data.failed + ' (of ' + data.total + ' pending)');
    location.reload();
  } catch(e) {
    alert('Error: ' + e.message);
  }
}

async function runFollowUps() {
  if (!confirm('Run follow-up sequence?\\n\\nSends Day-4 and Day-10 follow-ups to leads who haven\\'t replied. Auto-closes leads older than 30 days.')) return;
  try {
    const res = await fetch('/admin/run-follow-ups', { method: 'POST' });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    alert('Done. Follow-ups sent: ' + data.sent + ', Auto-closed: ' + data.closed);
    location.reload();
  } catch(e) {
    alert('Error: ' + e.message);
  }
}
</script>
</body>
</html>`;
}

function researchHTML(error, businesses, sector, city, dataSource) {
  const sourceBadge = dataSource === 'places'
    ? '<span style="background:#d4edda;color:#155724;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;margin-left:12px">✓ REAL (Google Places)</span>'
    : dataSource === 'claude'
    ? '<span style="background:#f8d7da;color:#721c24;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;margin-left:12px">⚠ Claude-generated (set GOOGLE_PLACES_API_KEY)</span>'
    : '';
  const resultsHTML = (businesses && businesses.length > 0) ? `
    <div class="results">
      <h3>Results: ${businesses.length} businesses found (${sector}, ${city})${sourceBadge}</h3>
      <form method="POST" action="/admin/research/add-leads">
        <table>
          <thead>
            <tr><th><input type="checkbox" id="selectAll" onchange="toggleAll(this)"></th><th>Business</th><th>Risk</th><th>Reason</th><th>Email</th><th>Website</th></tr>
          </thead>
          <tbody>
            ${businesses.map((b, i) => `
              <tr>
                <td><input type="checkbox" name="sel_${i}" class="biz-check"></td>
                <td><strong>${esc(b.business_name)}</strong><br><small>${esc(b.city)}</small></td>
                <td><span class="risk-badge risk-${b.risk_level}">${b.risk_level}</span></td>
                <td style="font-size:13px;max-width:200px">${esc(b.trademark_risk_reason)}</td>
                <td style="font-size:13px">${esc(b.contact_email || '')}</td>
                <td style="font-size:13px">${esc(b.likely_website || '')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <input type="hidden" name="businesses" id="selectedBusinesses">
        <div style="margin-top:16px">
          <button type="button" onclick="addSelected()" class="btn-primary">Add Selected to Leads Database</button>
        </div>
        <script>
          const allBiz = ${JSON.stringify(businesses)};
          function toggleAll(cb) {
            document.querySelectorAll('.biz-check').forEach(c => c.checked = cb.checked);
          }
          function addSelected() {
            const selected = [];
            document.querySelectorAll('.biz-check').forEach((c, i) => {
              if (c.checked) selected.push(allBiz[i]);
            });
            if (selected.length === 0) { alert('Select at least one business'); return; }
            document.getElementById('selectedBusinesses').value = JSON.stringify(selected);
            document.querySelector('form[action="/admin/research/add-leads"]').submit();
          }
        <\/script>
      </form>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>BrandGuard — Research</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; margin: 0; background: #f0f2f5; }
    nav { background: #1a1a2e; padding: 12px 24px; display: flex; gap: 16px; align-items: center; }
    nav a { color: #aaa; text-decoration: none; font-size: 14px; }
    nav a:hover, nav a.active { color: #fff; }
    nav .logo { color: #fff; font-weight: 700; margin-right: 16px; }
    .container { max-width: 1200px; margin: 32px auto; padding: 0 24px; }
    .form-card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 32px; }
    label { display:block; font-size:14px; font-weight:600; margin-bottom:6px; color:#333; }
    input, select, textarea { width:100%; padding:10px 12px; border:1.5px solid #ddd; border-radius:8px; font-size:14px; margin-bottom:16px; font-family: inherit; }
    .btn-primary { padding:12px 24px; background:#e94560; color:#fff; border:none; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer; }
    .results { background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:10px; text-align:left; font-size:13px; color:#666; border-bottom:1px solid #eee; }
    td { padding:10px; font-size:14px; border-bottom:1px solid #f5f5f5; vertical-align:top; }
    .risk-badge { padding:3px 8px; border-radius:4px; font-size:12px; font-weight:700; }
    .risk-high { background:#ffe0e0; color:#c0392b; }
    .risk-medium { background:#fff3cd; color:#856404; }
    .risk-low { background:#d1ecf1; color:#0c5460; }
    .error { color:#e94560; margin-bottom:16px; }
  </style>
</head>
<body>
<nav>
  <span class="logo">BrandGuard</span>
  <a href="/admin/leads">Leads</a>
  <a href="/admin/research" class="active">Research</a>
  <a href="/admin/logout">Logout</a>
</nav>
<div class="container">
  <div class="form-card">
    <h2 style="margin-bottom:24px;color:#1a1a2e">Business Research Tool</h2>
    ${error ? `<div class="error">${error}</div>` : ''}
    <form method="POST" action="/admin/research">
      <label>Sector</label>
      <select name="sector">
        <option value="εστιατόριο/καφέ">Εστιατόριο / Καφέ</option>
        <option value="λιανικό">Λιανικό εμπόριο</option>
        <option value="logistics">Logistics</option>
        <option value="ομορφιά">Ομορφιά / Αισθητική</option>
        <option value="τρόφιμα">Τρόφιμα / Παραγωγή</option>
        <option value="άλλο">Άλλο</option>
      </select>
      <label>City</label>
      <input type="text" name="city" placeholder="π.χ. Αθήνα" value="${esc(city || '')}">
      <label>Business names (optional — one per line, leave empty for AI generation)</label>
      <textarea name="business_names" rows="5" placeholder="Αφήστε κενό για αυτόματη παραγωγή από AI..."></textarea>
      <button type="submit" class="btn-primary">Run Research →</button>
    </form>
  </div>
  ${resultsHTML}
</div>
</body>
</html>`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── BATCH OUTREACH: auto-generate + auto-send ─────────────────────────────────

// POST /admin/send-outreach — takes a lead_id, generates email via Claude, sends via SendGrid
router.post('/send-outreach', async (req, res) => {
  try {
    const { lead_id } = req.body;
    const leadResult = await pool.query('SELECT * FROM leads WHERE id = $1', [lead_id]);
    if (leadResult.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    const lead = leadResult.rows[0];

    if (!lead.contact_email) {
      return res.status(400).json({ error: 'No contact_email for this lead — cannot send.' });
    }

    // Generate personalised email
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are writing outreach emails for BrandGuard, a Greek trademark protection service. The tone is helpful and informative, never threatening or alarming. Write in Greek. Be specific, warm, professional. Keep under 180 words. Return JSON: { "subject": "...", "body": "..." }.`,
      messages: [{
        role: 'user',
        content: `Business: ${lead.business_name} (${lead.sector || ''} in ${lead.city || 'Greece'}). Reason name may be unprotected: ${lead.trademark_notes || 'no registered Greek trademark found'}. Include: acknowledge business, mention no registered trademark, explain Greek first-to-file rule, offer free risk check, call to action to reply or visit brandguard.gr. Sign off as BrandGuard team.`,
      }],
    });

    const { subject, body } = JSON.parse(msg.content[0].text.trim());
    const sendResult = await sendOutreach({
      toEmail: lead.contact_email,
      toName: lead.contact_name,
      subject,
      body,
      leadId: lead.id,
      isFollowUp: false,
    });

    res.json({ success: sendResult.sent, reason: sendResult.reason });
  } catch (err) {
    console.error('Error sending outreach:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/send-batch — send outreach to ALL pending leads with a valid email
router.post('/send-batch', async (req, res) => {
  try {
    const { limit = 50 } = req.body;
    const result = await pool.query(`
      SELECT * FROM leads
      WHERE outreach_status = 'pending'
        AND contact_email IS NOT NULL
        AND contact_email <> ''
      ORDER BY created_at DESC
      LIMIT $1
    `, [Math.min(Number(limit) || 50, 200)]);

    let sent = 0, failed = 0;
    for (const lead of result.rows) {
      try {
        const msg = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `You are writing outreach emails for BrandGuard, a Greek trademark protection service. Tone: helpful, informative, never threatening. Write in Greek. Under 180 words. Return JSON: { "subject": "...", "body": "..." }.`,
          messages: [{
            role: 'user',
            content: `Business: ${lead.business_name} (${lead.sector || ''} in ${lead.city || 'Greece'}). Reason: ${lead.trademark_notes || 'no registered Greek trademark found'}. Acknowledge business, mention Greek first-to-file rule, offer free risk check, CTA to reply or visit brandguard.gr. Sign off as BrandGuard team.`,
          }],
        });
        const { subject, body } = JSON.parse(msg.content[0].text.trim());
        const r = await sendOutreach({
          toEmail: lead.contact_email,
          toName: lead.contact_name,
          subject, body, leadId: lead.id, isFollowUp: false,
        });
        if (r.sent) sent++; else failed++;
      } catch (err) {
        console.error(`Batch send failed for lead ${lead.id}:`, err.message);
        failed++;
      }
    }

    res.json({ success: true, sent, failed, total: result.rows.length });
  } catch (err) {
    console.error('Error in batch send:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/run-follow-ups — runs Day 4 / Day 10 follow-up sequence + auto-closes old leads
// Can be hit manually from dashboard or called by a scheduled cron job
router.post('/run-follow-ups', async (req, res) => {
  try {
    const result = await runFollowUpSequence(async (lead) => {
      // Generate follow-up email via Claude
      const count = lead.follow_up_count || 0;
      const tone = count === 0 ? 'a gentle first follow-up' : 'a final short nudge';
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: `You are writing a follow-up email for BrandGuard. Tone: warm, brief, Greek. Under 80 words. Return JSON: { "subject": "...", "body": "..." }.`,
        messages: [{
          role: 'user',
          content: `Write ${tone} to ${lead.business_name} (${lead.sector}, ${lead.city}). Reference the previous email about trademark risk. Offer one more chance to get the free check. Sign off BrandGuard team.`,
        }],
      });
      return JSON.parse(msg.content[0].text.trim());
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Error running follow-ups:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
