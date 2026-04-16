const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendInboundConfirmation, sendAdminNotification } = require('../email');
const { landingPageHTML, thankYouHTML, paymentPageHTML } = require('../views/landing');
const { staticPageHTML } = require('../views/static-pages');
const { blogIndexHTML, blogPostHTML, getAllPosts } = require('../views/blog');

// Landing page
router.get('/', (req, res) => {
  res.send(landingPageHTML());
});

// Handle inbound lead form submission
router.post('/submit-lead', async (req, res) => {
  try {
    const { business_name, contact_name, contact_email, sector, city,
            utm_source, utm_medium, utm_campaign, ref } = req.body;

    if (!business_name || !contact_email) {
      return res.status(400).send('Απαιτούνται το όνομα επιχείρησης και το email.');
    }

    // Build a compact source string for tracking:
    // "inbound" | "inbound:partner:maria" | "inbound:utm:google/cpc/brand-search"
    let sourceString = 'inbound';
    if (ref) {
      sourceString = `inbound:partner:${String(ref).slice(0, 40)}`;
    } else if (utm_source) {
      sourceString = `inbound:utm:${utm_source}${utm_medium ? '/' + utm_medium : ''}${utm_campaign ? '/' + utm_campaign : ''}`.slice(0, 120);
    }

    const result = await pool.query(
      `INSERT INTO leads (business_name, contact_name, contact_email, sector, city, source, trademark_status, outreach_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'unknown', 'pending')
       RETURNING id`,
      [business_name, contact_name, contact_email, sector, city, sourceString]
    );

    const leadId = result.rows[0].id;
    console.log(`New inbound lead created: id=${leadId}, business=${business_name}`);

    // Send admin notification (confirmation email sent after payment)
    try { await sendAdminNotification({ business_name, contact_name, contact_email, sector, city, leadId }); }
    catch (emailErr) { console.error('Failed to send admin notification:', emailErr.message); }

    // Redirect to Stripe checkout for the €9 trademark check
    res.redirect(`/create-checkout?product=check&lead_id=${leadId}`);
  } catch (err) {
    console.error('Error saving inbound lead:', err.message);
    res.status(500).send('Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.');
  }
});

// Payment page
router.get('/payment', (req, res) => {
  const product = req.query.product;
  const leadId = req.query.lead_id || '';
  res.send(paymentPageHTML(product, leadId));
});

// Static pages
router.get('/how-it-works', (req, res) => res.send(staticPageHTML('how-it-works')));
router.get('/pricing', (req, res) => res.send(staticPageHTML('pricing')));
router.get('/faq', (req, res) => res.send(staticPageHTML('faq')));
router.get('/privacy', (req, res) => res.send(staticPageHTML('privacy')));
router.get('/terms', (req, res) => res.send(staticPageHTML('terms')));
router.get('/about', (req, res) => res.send(staticPageHTML('about')));
router.get('/partner', (req, res) => res.send(staticPageHTML('partner')));

// Blog
router.get('/blog', (req, res) => res.send(blogIndexHTML()));
router.get('/blog/:slug', (req, res) => {
  const html = blogPostHTML(req.params.slug);
  if (!html) return res.status(404).send('Post not found');
  res.send(html);
});

// GDPR unsubscribe
router.get('/unsubscribe', async (req, res) => {
  const { email, token } = req.query;
  if (!email || !token) return res.status(400).send(unsubscribePageHTML('Λείπουν παράμετροι.', false));

  const { verifyUnsubscribeToken } = require('../lib/outreach');
  if (!verifyUnsubscribeToken(email, token)) {
    return res.status(400).send(unsubscribePageHTML('Μη έγκυρος σύνδεσμος.', false));
  }

  try {
    await pool.query(
      `INSERT INTO suppression_list (email, reason) VALUES ($1, 'unsubscribe')
       ON CONFLICT (email) DO NOTHING`,
      [String(email).toLowerCase()]
    );
    await pool.query(
      `UPDATE leads SET outreach_status = 'dead', notes = COALESCE(notes, '') || ' [unsubscribed]' WHERE LOWER(contact_email) = LOWER($1)`,
      [email]
    );
    console.log(`[unsubscribe] ${email} added to suppression list`);
    res.send(unsubscribePageHTML('Αφαιρεθήκατε επιτυχώς από τη λίστα μας. Δεν θα λάβετε άλλα email από το BrandGuard.', true));
  } catch (err) {
    console.error('Unsubscribe error:', err.message);
    res.status(500).send(unsubscribePageHTML('Παρουσιάστηκε σφάλμα.', false));
  }
});

function unsubscribePageHTML(message, ok) {
  return `<!DOCTYPE html><html lang="el"><head><meta charset="UTF-8"><title>BrandGuard — Διαγραφή</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif;background:#fafbfc;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;margin:0}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:48px;max-width:480px;text-align:center;box-shadow:0 20px 60px -20px rgba(15,23,42,0.15)}
.icon{font-size:56px;margin-bottom:20px}h2{font-size:26px;font-weight:800;margin-bottom:12px;color:#0f172a}
p{color:#475569;line-height:1.65;font-size:15px}a{color:#e11d48;font-weight:600;text-decoration:none}</style></head>
<body><div class="card"><div class="icon">${ok ? '✅' : '⚠️'}</div><h2>${ok ? 'Επιτυχία' : 'Σφάλμα'}</h2><p>${message}</p><p style="margin-top:20px"><a href="/">← Επιστροφή</a></p></div></body></html>`;
}

// Robots.txt
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /webhook
Disallow: /create-checkout
Disallow: /payment-success

Sitemap: https://brandguard.gr/sitemap.xml`);
});

router.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const posts = getAllPosts();
  const postUrls = posts.map(p => `  <url><loc>https://brandguard.gr/blog/${p.slug}</loc><priority>0.8</priority><lastmod>${p.date}</lastmod></url>`).join('\n');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://brandguard.gr/</loc><priority>1.0</priority></url>
  <url><loc>https://brandguard.gr/pricing</loc><priority>0.9</priority></url>
  <url><loc>https://brandguard.gr/how-it-works</loc><priority>0.8</priority></url>
  <url><loc>https://brandguard.gr/blog</loc><priority>0.8</priority></url>
${postUrls}
  <url><loc>https://brandguard.gr/faq</loc><priority>0.7</priority></url>
  <url><loc>https://brandguard.gr/about</loc><priority>0.6</priority></url>
  <url><loc>https://brandguard.gr/privacy</loc><priority>0.3</priority></url>
  <url><loc>https://brandguard.gr/terms</loc><priority>0.3</priority></url>
</urlset>`);
});

module.exports = router;
