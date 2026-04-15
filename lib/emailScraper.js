// Email scraper — fetches a business website and extracts real contact emails.
// Checks homepage, then /contact /επικοινωνία /about pages. Returns best guess.

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const CONTACT_PATHS = [
  '', '/contact', '/contact/', '/επικοινωνία', '/contact-us',
  '/about', '/el/contact', '/en/contact'
];

const EMAIL_REGEX = /[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Filter out obviously bad matches (sentry, image filenames, etc.)
function isLikelyRealEmail(email) {
  if (!email || email.length > 100) return false;
  const lower = email.toLowerCase();
  if (/(wixpress|sentry|example|sample|\.png|\.jpg|\.jpeg|\.gif|\.svg|noreply|no-reply|donotreply)/.test(lower)) return false;
  // Must have reasonable local-part length
  const [local] = lower.split('@');
  if (local.length < 2 || local.length > 40) return false;
  return true;
}

async function fetchWithTimeout(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'BrandGuardBot/1.0 (+https://brandguard.gr)' },
      redirect: 'follow',
    });
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Scrape a business website for contact emails.
 * Returns { email: 'best@guess.gr', all: [...], source: 'homepage'|'contact-page'|null }
 */
async function scrapeContactEmail(website) {
  if (!website) return { email: null, all: [], source: null };
  const base = website.startsWith('http') ? website : `https://${website}`;
  const found = new Set();
  let source = null;

  for (const path of CONTACT_PATHS) {
    try {
      const html = await fetchWithTimeout(base.replace(/\/$/, '') + path);
      const $ = cheerio.load(html);

      // Grab mailto: links first (highest confidence)
      $('a[href^="mailto:"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const email = href.replace(/^mailto:/, '').split('?')[0].trim();
        if (isLikelyRealEmail(email)) {
          found.add(email.toLowerCase());
          if (!source) source = path === '' ? 'homepage-mailto' : `contact-page-mailto`;
        }
      });

      // Also grep raw HTML text for emails (catches obfuscated ones written as plain text)
      const matches = html.match(EMAIL_REGEX) || [];
      for (const m of matches) {
        if (isLikelyRealEmail(m)) {
          found.add(m.toLowerCase());
          if (!source) source = path === '' ? 'homepage-text' : 'contact-page-text';
        }
      }

      // If we found anything on homepage, no need to keep fetching sub-pages
      if (found.size > 0 && path === '') break;
    } catch (err) {
      // Silent — try next path
    }
  }

  const all = [...found];
  // Prefer info@ / contact@ / hello@ over personal emails
  const prefer = all.find(e => /^(info|contact|hello|επικοινωνία|sales|reservations)@/.test(e));
  return {
    email: prefer || all[0] || null,
    all,
    source,
  };
}

module.exports = { scrapeContactEmail };
