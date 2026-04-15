const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendInboundConfirmation, sendAdminNotification } = require('../email');

// Landing page
router.get('/', (req, res) => {
  res.send(landingPageHTML());
});

// Handle inbound lead form submission
router.post('/submit-lead', async (req, res) => {
  try {
    const { business_name, contact_name, contact_email, sector, city } = req.body;

    if (!business_name || !contact_email) {
      return res.status(400).send('Απαιτούνται το όνομα επιχείρησης και το email.');
    }

    // Save lead to database
    const result = await pool.query(
      `INSERT INTO leads (business_name, contact_name, contact_email, sector, city, source, trademark_status, outreach_status)
       VALUES ($1, $2, $3, $4, $5, 'inbound', 'unknown', 'pending')
       RETURNING id`,
      [business_name, contact_name, contact_email, sector, city]
    );

    const leadId = result.rows[0].id;
    console.log(`New inbound lead created: id=${leadId}, business=${business_name}`);

    // Send confirmation email to user
    try {
      await sendInboundConfirmation(contact_email, contact_name, business_name);
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr.message);
    }

    // Send admin notification
    try {
      await sendAdminNotification({ business_name, contact_name, contact_email, sector, city, leadId });
    } catch (emailErr) {
      console.error('Failed to send admin notification:', emailErr.message);
    }

    res.send(thankYouHTML(business_name));
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

// GDPR unsubscribe — accepts ?email=&token= from outreach footer
router.get('/unsubscribe', async (req, res) => {
  const { email, token } = req.query;
  if (!email || !token) {
    return res.status(400).send(unsubscribePageHTML('Λείπουν παράμετροι.', false));
  }

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
    // Also mark any matching leads as dead
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
<style>body{font-family:-apple-system,sans-serif;background:#f8f9fa;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:#fff;border-radius:12px;padding:40px;max-width:460px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
.icon{font-size:40px;margin-bottom:16px}h2{color:#1a1a2e;margin-bottom:12px}p{color:#555;line-height:1.6}</style></head>
<body><div class="card"><div class="icon">${ok ? '✅' : '⚠️'}</div><h2>${ok ? 'Επιτυχία' : 'Σφάλμα'}</h2><p>${message}</p><p style="margin-top:16px"><a href="/" style="color:#e94560">← Επιστροφή</a></p></div></body></html>`;
}

// Robots.txt
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://brandguard.gr/sitemap.xml');
});

// Sitemap
router.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://brandguard.gr/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

function landingPageHTML() {
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrandGuard — Προστατέψτε το brand σας στην Ελλάδα</title>
  <meta name="description" content="Ελέγξτε δωρεάν αν το εμπορικό σήμα σας είναι καταχωρημένο. Χιλιάδες ελληνικές επιχειρήσεις λειτουργούν χωρίς προστασία.">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; color: #212529; }
    header { background: #1a1a2e; padding: 16px 24px; display: flex; align-items: center; }
    header h1 { color: #fff; font-size: 22px; letter-spacing: -0.5px; }
    header span { color: #e94560; }
    .hero { max-width: 680px; margin: 60px auto 0; padding: 0 24px; text-align: center; }
    .hero h2 { font-size: 36px; font-weight: 800; color: #1a1a2e; line-height: 1.2; margin-bottom: 16px; }
    .hero p { font-size: 18px; color: #555; line-height: 1.6; margin-bottom: 40px; }
    .form-card { background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 520px; margin: 0 auto 60px; text-align: left; }
    .form-card h3 { font-size: 20px; margin-bottom: 24px; color: #1a1a2e; }
    label { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px; }
    input, select { width: 100%; padding: 12px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 15px; margin-bottom: 18px; outline: none; transition: border-color 0.2s; }
    input:focus, select:focus { border-color: #e94560; }
    button[type="submit"] { width: 100%; padding: 14px; background: #e94560; color: #fff; font-size: 16px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    button[type="submit"]:hover { background: #c73652; }
    .trust { display: flex; gap: 24px; justify-content: center; margin: 0 auto 60px; max-width: 600px; padding: 0 24px; flex-wrap: wrap; }
    .trust-item { text-align: center; flex: 1; min-width: 140px; }
    .trust-item .icon { font-size: 32px; margin-bottom: 8px; }
    .trust-item p { font-size: 14px; color: #666; }
    footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 24px; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <h1>Brand<span>Guard</span></h1>
  </header>
  <div class="hero">
    <h2>Το brand σου είναι προστατευμένο;</h2>
    <p>Χιλιάδες ελληνικές επιχειρήσεις λειτουργούν χωρίς καταχωρημένο εμπορικό σήμα — και δεν το ξέρουν. Κάποιος άλλος μπορεί να το καταχωρήσει πρώτος.</p>
  </div>
  <div class="form-card">
    <h3>Ζητήστε δωρεάν έλεγχο</h3>
    <form method="POST" action="/submit-lead">
      <label>Όνομα Επιχείρησης *</label>
      <input type="text" name="business_name" required placeholder="π.χ. Καφέ Αρτέμιδα">
      <label>Το Όνομά σας *</label>
      <input type="text" name="contact_name" required placeholder="Ονοματεπώνυμο">
      <label>Email *</label>
      <input type="email" name="contact_email" required placeholder="email@example.com">
      <label>Κλάδος</label>
      <select name="sector">
        <option value="εστιατόριο/καφέ">Εστιατόριο / Καφέ</option>
        <option value="λιανικό">Λιανικό εμπόριο</option>
        <option value="logistics">Logistics</option>
        <option value="ομορφιά">Ομορφιά / Αισθητική</option>
        <option value="τρόφιμα">Τρόφιμα / Παραγωγή</option>
        <option value="άλλο">Άλλο</option>
      </select>
      <label>Πόλη</label>
      <input type="text" name="city" placeholder="π.χ. Αθήνα">
      <button type="submit">Ζητήστε δωρεάν έλεγχο →</button>
    </form>
  </div>
  <div class="trust">
    <div class="trust-item"><div class="icon">🔍</div><p>Έλεγχος εμπορικού σήματος στη βάση ΟΒΙ & EUIPO</p></div>
    <div class="trust-item"><div class="icon">⚡</div><p>Αποτέλεσμα εντός 2 εργάσιμων ημερών</p></div>
    <div class="trust-item"><div class="icon">🇬🇷</div><p>Εξειδίκευση στην ελληνική νομοθεσία</p></div>
  </div>
  <footer>
    <p>© 2025 BrandGuard | Η υπηρεσία αυτή είναι ενημερωτικού χαρακτήρα και δεν αποτελεί νομική συμβουλή.</p>
  </footer>
</body>
</html>`;
}

function thankYouHTML(businessName) {
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrandGuard — Ευχαριστούμε</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h2 { color: #1a1a2e; margin-bottom: 12px; }
    p { color: #555; line-height: 1.6; }
    a { color: #e94560; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h2>Ευχαριστούμε!</h2>
    <p>Λάβαμε το αίτημά σας για <strong>${businessName}</strong>. Θα επικοινωνήσουμε μαζί σας εντός 2 εργάσιμων ημερών με τα αποτελέσματα του ελέγχου.</p>
    <p style="margin-top:16px;"><a href="/">← Επιστροφή στην αρχική</a></p>
  </div>
</body>
</html>`;
}

function paymentPageHTML(product, leadId) {
  const products = {
    report: { name: 'BrandGuard Risk Report', price: '€29', description: 'Πλήρης έκθεση κινδύνου εμπορικού σήματος για την επιχείρησή σας.' },
    kit: { name: 'BrandGuard Filing Kit', price: '€79', description: 'Πλήρες kit κατάθεσης εμπορικού σήματος — έτοιμο για υποβολή στον ΟΒΙ.' },
  };
  const p = products[product] || products['report'];
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>BrandGuard — ${p.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 12px; padding: 40px; max-width: 420px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; }
    h2 { color: #1a1a2e; margin-bottom: 8px; }
    .price { font-size: 48px; font-weight: 800; color: #e94560; margin: 16px 0; }
    p { color: #555; line-height: 1.6; margin-bottom: 24px; }
    a.btn { display: block; padding: 14px; background: #e94560; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; }
    a.btn:hover { background: #c73652; }
  </style>
</head>
<body>
  <div class="card">
    <h2>${p.name}</h2>
    <div class="price">${p.price}</div>
    <p>${p.description}</p>
    <a class="btn" href="/create-checkout?product=${product}&lead_id=${leadId}">Πληρωμή με κάρτα →</a>
    <p style="margin-top:16px;font-size:13px;color:#999;">Ασφαλής πληρωμή μέσω Stripe</p>
  </div>
</body>
</html>`;
}

module.exports = router;
