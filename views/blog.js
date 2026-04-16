// Blog engine — lightweight, no markdown library needed.
// Articles live as JS modules in /content/posts/*.js and export { slug, title, date, description, bodyHTML }.

const fs = require('fs');
const path = require('path');

// Load all posts at startup
const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
let POSTS = [];
try {
  if (fs.existsSync(POSTS_DIR)) {
    POSTS = fs.readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.js'))
      .map(f => require(path.join(POSTS_DIR, f)))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }
} catch (err) {
  console.error('Error loading blog posts:', err.message);
}

const SHARED_HEAD = `
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Lora:wght@400;600&display=swap" rel="stylesheet">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:#fafbfc;color:#0f172a;line-height:1.7}
    a{color:#e11d48;text-decoration:none}
    a:hover{text-decoration:underline}
    nav.topnav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #e5e7eb}
    .nav-inner{max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
    .logo{font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;display:flex;align-items:center;gap:8px}
    .logo:hover{text-decoration:none}
    .logo-dot{width:10px;height:10px;border-radius:50%;background:#e11d48}
    .nav-links{display:flex;gap:28px;font-size:14px;font-weight:500;color:#475569}
    .nav-links a{color:#475569}
    .nav-links a:hover{color:#0f172a;text-decoration:none}
    .nav-cta{background:#0f172a;color:#fff;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:600}
    .nav-cta:hover{background:#1e293b;text-decoration:none;color:#fff}
    @media(max-width:640px){.nav-links{display:none}}

    .index{max-width:900px;margin:0 auto;padding:60px 24px 80px}
    .index h1{font-size:44px;font-weight:800;letter-spacing:-1.2px;margin-bottom:12px;color:#0f172a}
    .index .lead{font-size:19px;color:#64748b;margin-bottom:40px}
    .post-list{list-style:none}
    .post-list li{border-bottom:1px solid #e5e7eb;padding:28px 0}
    .post-list li:last-child{border-bottom:none}
    .post-list a{color:#0f172a;text-decoration:none}
    .post-list a:hover{color:#e11d48}
    .post-date{font-size:13px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;display:block}
    .post-title{font-size:24px;font-weight:700;line-height:1.3;margin-bottom:8px}
    .post-desc{font-size:16px;color:#475569}

    .article{max-width:720px;margin:0 auto;padding:60px 24px 80px}
    .article .article-meta{font-size:13px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
    .article h1{font-size:40px;font-weight:800;letter-spacing:-1px;line-height:1.15;margin-bottom:16px;color:#0f172a}
    .article .article-lead{font-size:19px;color:#475569;margin-bottom:40px;font-family:'Lora',serif;font-style:italic;padding-left:20px;border-left:4px solid #e11d48}
    .article h2{font-size:28px;font-weight:700;margin-top:48px;margin-bottom:14px;letter-spacing:-0.5px}
    .article h3{font-size:20px;font-weight:600;margin-top:28px;margin-bottom:10px}
    .article p{margin-bottom:16px;color:#334155;font-size:17px}
    .article ul,.article ol{margin:16px 0 16px 28px;color:#334155}
    .article li{padding:4px 0;font-size:17px}
    .article .cta-box{background:linear-gradient(135deg,#fef2f2 0%,#fef3f2 100%);border:1px solid #fecaca;border-radius:12px;padding:24px;margin:36px 0;text-align:center}
    .article .cta-box h3{margin-top:0;margin-bottom:8px;color:#9f1239}
    .article .cta-box a{display:inline-block;margin-top:16px;padding:12px 24px;background:#0f172a;color:#fff;border-radius:8px;font-weight:700;text-decoration:none}
    .article .cta-box a:hover{background:#e11d48}
    .article .callout{background:#fef9c3;border-left:4px solid #eab308;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;color:#713f12}

    footer{background:#fff;border-top:1px solid #e5e7eb;padding:40px 24px;margin-top:60px}
    footer .container{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;font-size:13px;color:#64748b}
    .footer-links{display:flex;gap:24px}
    .footer-links a{color:#64748b}
    .footer-links a:hover{color:#0f172a;text-decoration:none}
  </style>
`;

const NAV = `
<nav class="topnav">
  <div class="nav-inner">
    <a href="/" class="logo"><span class="logo-dot"></span>BrandGuard</a>
    <div class="nav-links">
      <a href="/how-it-works">Πώς λειτουργεί</a>
      <a href="/pricing">Τιμές</a>
      <a href="/blog">Blog</a>
      <a href="/faq">FAQ</a>
    </div>
    <a href="/#check" class="nav-cta">Έλεγχος €9 →</a>
  </div>
</nav>`;

const FOOTER = `
<footer>
  <div class="container">
    <div>© 2026 BrandGuard · <strong>Agentis Venture Studio</strong></div>
    <div class="footer-links">
      <a href="/privacy">Απόρρητο</a>
      <a href="/terms">Όροι</a>
      <a href="/about">Σχετικά</a>
      <a href="mailto:hello@brandguard.gr">Επικοινωνία</a>
    </div>
  </div>
</footer>`;

function blogIndexHTML() {
  const listItems = POSTS.map(p => `
    <li>
      <a href="/blog/${p.slug}">
        <span class="post-date">${formatDate(p.date)}</span>
        <div class="post-title">${p.title}</div>
        <div class="post-desc">${p.description}</div>
      </a>
    </li>
  `).join('');

  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Blog — BrandGuard</title>
<meta name="description" content="Οδηγοί και συμβουλές για την προστασία του brand σας στην Ελλάδα — κατοχύρωση, ΟΒΙ, EUIPO, νομικά.">
${SHARED_HEAD}
</head>
<body>
${NAV}
<main class="index">
  <h1>Blog</h1>
  <p class="lead">Πρακτικοί οδηγοί για την κατοχύρωση εμπορικού σήματος στην Ελλάδα — από την ομάδα του BrandGuard.</p>
  <ul class="post-list">
    ${listItems || '<li style="color:#94a3b8">Δεν υπάρχουν αναρτήσεις ακόμα.</li>'}
  </ul>
</main>
${FOOTER}
</body>
</html>`;
}

function blogPostHTML(slug) {
  const post = POSTS.find(p => p.slug === slug);
  if (!post) return null;
  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${post.title} — BrandGuard</title>
<meta name="description" content="${post.description}">
<meta property="og:title" content="${post.title}">
<meta property="og:description" content="${post.description}">
<meta property="og:type" content="article">
<meta property="og:locale" content="el_GR">
${SHARED_HEAD}
</head>
<body>
${NAV}
<article class="article">
  <div class="article-meta">${formatDate(post.date)} · BrandGuard Team</div>
  <h1>${post.title}</h1>
  <p class="article-lead">${post.description}</p>
  ${post.bodyHTML}
  <div class="cta-box">
    <h3>Ελέγξτε το δικό σας brand — μόνο €9</h3>
    <p>Εντός 48 ωρών θα ξέρετε αν το όνομα της επιχείρησής σας είναι νομικά προστατευμένο στην Ελλάδα.</p>
    <a href="/#check">Ξεκινήστε τον έλεγχο — €9 →</a>
  </div>
</article>
${FOOTER}
</body>
</html>`;
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  const months = ['Ιαν','Φεβ','Μαρ','Απρ','Μαϊ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ'];
  const d = new Date(isoDate);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getAllPosts() {
  return POSTS;
}

module.exports = { blogIndexHTML, blogPostHTML, getAllPosts };
