// Landing page HTML — professional redesign.
// Exported as a pure function so routes/public.js can require it.

function landingPageHTML() {
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrandGuard — Προστατέψτε το brand σας στην Ελλάδα</title>
  <meta name="description" content="Ελέγξτε αν το εμπορικό σας σήμα είναι καταχωρημένο στην Ελλάδα — μόνο €9. Χιλιάδες επιχειρήσεις λειτουργούν απροστάτευτες — μη είστε μία από αυτές.">
  <meta name="keywords" content="εμπορικό σήμα Ελλάδα, trademark Greece, OBI, ΟΒΙ, κατοχύρωση σήματος, BrandGuard">
  <meta property="og:title" content="BrandGuard — Προστατέψτε το brand σας">
  <meta property="og:description" content="Έλεγχος κατοχύρωσης εμπορικού σήματος για ελληνικές επιχειρήσεις — μόνο €9.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://brandguard.gr">
  <meta property="og:locale" content="el_GR">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:#fafbfc;color:#0f172a;line-height:1.6;-webkit-font-smoothing:antialiased}
    a{color:inherit;text-decoration:none}
    img{max-width:100%;display:block}

    /* Nav */
    nav.topnav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #e5e7eb}
    .nav-inner{max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
    .logo{font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;display:flex;align-items:center;gap:8px}
    .logo-dot{width:10px;height:10px;border-radius:50%;background:#e11d48}
    .nav-links{display:flex;gap:28px;font-size:14px;font-weight:500;color:#475569}
    .nav-links a:hover{color:#0f172a}
    .nav-cta{background:#0f172a;color:#fff;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:600;transition:background 0.2s}
    .nav-cta:hover{background:#1e293b}
    @media(max-width:640px){.nav-links{display:none}}

    /* Hero */
    .hero{max-width:1200px;margin:0 auto;padding:80px 24px 60px;display:grid;grid-template-columns:1.15fr 1fr;gap:60px;align-items:center}
    @media(max-width:960px){.hero{grid-template-columns:1fr;padding:48px 24px}}
    .hero-badge{display:inline-flex;align-items:center;gap:8px;background:#fef2f2;color:#be123c;padding:6px 14px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:20px}
    .hero h1{font-size:52px;line-height:1.05;font-weight:800;letter-spacing:-1.5px;color:#0f172a;margin-bottom:20px}
    .hero h1 .hl{background:linear-gradient(120deg,#e11d48 0%,#f43f5e 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    @media(max-width:640px){.hero h1{font-size:36px}}
    .hero-sub{font-size:19px;color:#475569;line-height:1.55;margin-bottom:28px;max-width:520px}
    .hero-stats{display:flex;gap:32px;margin-top:36px;padding-top:32px;border-top:1px solid #e5e7eb}
    .hero-stat .n{font-size:28px;font-weight:800;color:#0f172a;letter-spacing:-1px}
    .hero-stat .l{font-size:13px;color:#64748b;margin-top:2px}

    /* Form card */
    .form-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;box-shadow:0 20px 60px -20px rgba(15,23,42,0.15)}
    .form-card h3{font-size:22px;font-weight:700;margin-bottom:6px;color:#0f172a}
    .form-card .ptag{font-size:14px;color:#64748b;margin-bottom:24px}
    label{display:block;font-size:13px;font-weight:600;color:#334155;margin-bottom:6px;margin-top:14px}
    label:first-of-type{margin-top:0}
    input,select{width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;font-family:inherit;background:#fff;transition:all 0.15s;color:#0f172a}
    input:focus,select:focus{outline:none;border-color:#e11d48;box-shadow:0 0 0 3px rgba(225,29,72,0.1)}
    button[type="submit"]{width:100%;margin-top:20px;padding:14px;background:#0f172a;color:#fff;font-size:15px;font-weight:700;border:none;border-radius:10px;cursor:pointer;transition:all 0.15s;font-family:inherit}
    button[type="submit"]:hover{background:#e11d48;transform:translateY(-1px)}
    .form-note{font-size:12px;color:#94a3b8;margin-top:14px;text-align:center}

    /* Section base */
    section{padding:80px 24px}
    .container{max-width:1200px;margin:0 auto}
    .section-label{font-size:13px;font-weight:700;color:#e11d48;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
    .section-title{font-size:40px;font-weight:800;color:#0f172a;letter-spacing:-1px;line-height:1.1;margin-bottom:16px;max-width:680px}
    .section-sub{font-size:18px;color:#64748b;line-height:1.55;max-width:640px;margin-bottom:48px}

    /* Problem section */
    .problem{background:#0f172a;color:#fff}
    .problem .section-label{color:#fca5a5}
    .problem .section-title{color:#fff}
    .problem .section-sub{color:#94a3b8}
    .problem-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px}
    @media(max-width:840px){.problem-grid{grid-template-columns:1fr}}
    .problem-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:28px}
    .problem-card .num{font-size:36px;font-weight:800;color:#e11d48;margin-bottom:12px;display:block}
    .problem-card h4{font-size:18px;font-weight:700;margin-bottom:8px}
    .problem-card p{font-size:14px;color:#cbd5e1;line-height:1.55}

    /* How it works */
    .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:48px}
    @media(max-width:840px){.steps{grid-template-columns:1fr}}
    .step{position:relative;padding:24px 0}
    .step-num{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:#fef2f2;color:#e11d48;font-weight:800;font-size:18px;margin-bottom:16px}
    .step h4{font-size:18px;font-weight:700;margin-bottom:8px;color:#0f172a}
    .step p{font-size:15px;color:#64748b;line-height:1.6}

    /* Pricing */
    .pricing{background:linear-gradient(180deg,#fafbfc 0%,#fff 100%)}
    .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
    @media(max-width:960px){.pricing-grid{grid-template-columns:1fr}}
    .price-card{background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;padding:32px;display:flex;flex-direction:column;position:relative;transition:all 0.2s}
    .price-card:hover{border-color:#cbd5e1;transform:translateY(-4px);box-shadow:0 20px 40px -15px rgba(15,23,42,0.12)}
    .price-card.featured{border-color:#0f172a;border-width:2px;box-shadow:0 20px 40px -15px rgba(15,23,42,0.18)}
    .featured-badge{position:absolute;top:-13px;left:32px;background:#0f172a;color:#fff;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:0.5px}
    .price-name{font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#e11d48;margin-bottom:8px}
    .price-amt{font-size:48px;font-weight:800;color:#0f172a;letter-spacing:-1.5px;line-height:1}
    .price-amt .per{font-size:16px;font-weight:500;color:#64748b}
    .price-desc{font-size:14px;color:#64748b;margin:16px 0 24px;min-height:42px}
    .price-feats{list-style:none;flex:1}
    .price-feats li{font-size:14px;color:#334155;padding:8px 0;padding-left:28px;position:relative;line-height:1.5}
    .price-feats li::before{content:"✓";position:absolute;left:0;top:8px;color:#10b981;font-weight:800}
    .price-cta{margin-top:24px;display:block;text-align:center;padding:13px;background:#fff;color:#0f172a;font-weight:700;border:1.5px solid #0f172a;border-radius:10px;transition:all 0.15s}
    .price-cta:hover{background:#0f172a;color:#fff}
    .price-card.featured .price-cta{background:#0f172a;color:#fff}
    .price-card.featured .price-cta:hover{background:#e11d48;border-color:#e11d48}

    /* Testimonial / trust */
    .trust{background:#fff;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb}
    .trust-quote{max-width:800px;margin:0 auto;text-align:center}
    .trust-quote blockquote{font-size:26px;font-weight:600;line-height:1.4;color:#0f172a;letter-spacing:-0.5px;margin-bottom:24px}
    .trust-author{font-size:14px;color:#64748b}
    .trust-author strong{color:#0f172a;font-weight:600}

    /* FAQ */
    .faq-list{max-width:780px;margin-top:32px}
    details{border-bottom:1px solid #e5e7eb;padding:20px 0}
    details summary{font-size:17px;font-weight:600;color:#0f172a;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center}
    details summary::after{content:"+";font-size:24px;font-weight:300;color:#e11d48;transition:transform 0.2s}
    details[open] summary::after{transform:rotate(45deg)}
    details p{margin-top:12px;color:#475569;font-size:15px;line-height:1.65}

    /* CTA footer */
    .final-cta{background:#0f172a;color:#fff;text-align:center;padding:80px 24px}
    .final-cta h2{font-size:40px;font-weight:800;letter-spacing:-1px;line-height:1.1;margin-bottom:16px;color:#fff}
    .final-cta p{font-size:18px;color:#94a3b8;max-width:560px;margin:0 auto 32px}
    .final-cta .btn{display:inline-block;background:#e11d48;color:#fff;padding:16px 32px;border-radius:10px;font-weight:700;font-size:16px;transition:all 0.15s}
    .final-cta .btn:hover{background:#be123c;transform:translateY(-2px)}

    /* Footer */
    footer{background:#fff;border-top:1px solid #e5e7eb;padding:40px 24px;text-align:center}
    footer .container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
    @media(max-width:640px){footer .container{justify-content:center;text-align:center}}
    .footer-links{display:flex;gap:24px;font-size:13px;color:#64748b}
    .footer-links a:hover{color:#0f172a}
    .footer-copy{font-size:13px;color:#94a3b8}
  </style>
</head>
<body>

<nav class="topnav">
  <div class="nav-inner">
    <a href="/" class="logo"><span class="logo-dot"></span>BrandGuard</a>
    <div class="nav-links">
      <a href="#how">Πώς λειτουργεί</a>
      <a href="#pricing">Τιμές</a>
      <a href="/blog">Blog</a>
      <a href="#faq">FAQ</a>
    </div>
    <a href="#check" class="nav-cta">Έλεγχος €9 →</a>
  </div>
</nav>

<!-- HERO -->
<header class="hero" id="check">
  <div>
    <div class="hero-badge">🇬🇷 Ειδικά για ελληνικές επιχειρήσεις</div>
    <h1>Το όνομα της επιχείρησής σας είναι <span class="hl">πραγματικά δικό σας</span>;</h1>
    <p class="hero-sub">Στην Ελλάδα ισχύει ο κανόνας «first-to-file». Αν κάποιος άλλος καταχωρήσει πρώτος το εμπορικό σας σήμα, χάνετε νομικά το δικαίωμα στο δικό σας brand. <strong style="color:#0f172a">Χιλιάδες επιχειρήσεις λειτουργούν απροστάτευτες — και δεν το ξέρουν.</strong></p>
    <div class="hero-stats">
      <div class="hero-stat"><div class="n">72%</div><div class="l">SMBs χωρίς σήμα</div></div>
      <div class="hero-stat"><div class="n">€3–8K</div><div class="l">Μέσο κόστος διαμάχης</div></div>
      <div class="hero-stat"><div class="n">48h</div><div class="l">Αποτέλεσμα ελέγχου</div></div>
    </div>
  </div>

  <div class="form-card">
    <h3>Έλεγχος κινδύνου — €9</h3>
    <p class="ptag">Ελέγχουμε OBI + EUIPO και σας στέλνουμε έκθεση εντός 48 ωρών. Μόνο €9.</p>
    <form method="POST" action="/submit-lead">
      <input type="hidden" name="utm_source" id="utm_source">
      <input type="hidden" name="utm_medium" id="utm_medium">
      <input type="hidden" name="utm_campaign" id="utm_campaign">
      <input type="hidden" name="ref" id="ref">
      <label>Όνομα επιχείρησης *</label>
      <input type="text" name="business_name" required placeholder="π.χ. Καφέ Αρτέμιδα">
      <label>Το όνομά σας *</label>
      <input type="text" name="contact_name" required placeholder="Ονοματεπώνυμο">
      <label>Email *</label>
      <input type="email" name="contact_email" required placeholder="email@example.com">
      <label>Κλάδος</label>
      <select name="sector">
        <option value="εστιατόριο/καφέ">Εστιατόριο / Καφέ</option>
        <option value="λιανικό">Λιανικό εμπόριο</option>
        <option value="logistics">Logistics / Μεταφορές</option>
        <option value="ομορφιά">Ομορφιά / Αισθητική</option>
        <option value="τρόφιμα">Τρόφιμα / Παραγωγή</option>
        <option value="υπηρεσίες">Επαγγελματικές υπηρεσίες</option>
        <option value="e-commerce">E-commerce</option>
        <option value="άλλο">Άλλο</option>
      </select>
      <label>Πόλη</label>
      <input type="text" name="city" placeholder="π.χ. Αθήνα">
      <button type="submit">Ξεκινήστε τον έλεγχο — €9 →</button>
      <p class="form-note">🔒 Ασφαλής πληρωμή μέσω Stripe. Αποτέλεσμα εντός 48 ωρών.</p>
    </form>
  </div>
</header>

<!-- PROBLEM -->
<section class="problem">
  <div class="container">
    <div class="section-label">Ο κίνδυνος</div>
    <h2 class="section-title">Τι συμβαίνει όταν κάποιος άλλος καταχωρήσει το όνομά σας πρώτος</h2>
    <p class="section-sub">Στην Ελλάδα δεν χρειάζεται να χρησιμοποιείτε ένα όνομα για να το διεκδικήσετε. Αρκεί να το δηλώσει πρώτος στον ΟΒΙ. Τα πραγματικά κόστη:</p>
    <div class="problem-grid">
      <div class="problem-card">
        <span class="num">€3.000+</span>
        <h4>Αναγκαστικό rebranding</h4>
        <p>Νέο λογότυπο, νέα επιγραφή, νέα συσκευασία, νέοι λογαριασμοί social. Για SMB συχνά ξεπερνά τα €5.000.</p>
      </div>
      <div class="problem-card">
        <span class="num">€1.500+</span>
        <h4>Νομικά έξοδα</h4>
        <p>Προσφυγή στον ΟΒΙ, δικηγορικές αμοιβές, διαπραγματεύσεις με αυτόν που καταχώρησε. Ακόμα και χαμένες υποθέσεις χρεώνονται.</p>
      </div>
      <div class="problem-card">
        <span class="num">6–12 μήνες</span>
        <h4>Χαμένοι μήνες ανάπτυξης</h4>
        <p>Όσο λύνετε το brand dispute, παγώνουν προωθητικές ενέργειες, franchise deals, εξαγωγές. Ανταγωνιστές κερδίζουν έδαφος.</p>
      </div>
    </div>
  </div>
</section>

<!-- HOW -->
<section id="how">
  <div class="container">
    <div class="section-label">Πώς λειτουργεί</div>
    <h2 class="section-title">3 βήματα, 48 ώρες, μηδέν ρίσκο</h2>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <h4>Συμπληρώνετε τη φόρμα</h4>
        <p>Όνομα επιχείρησης, κλάδος, πόλη. 30 δευτερόλεπτα. Πληρωμή €9 μέσω Stripe.</p>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <h4>Ελέγχουμε OBI + EUIPO</h4>
        <p>Ψάχνουμε κάθε υπάρχον καταχωρημένο σήμα που μπορεί να σας μπλοκάρει ή να σας εκθέσει σε νομικό κίνδυνο.</p>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <h4>Λαμβάνετε την έκθεση</h4>
        <p>Σαφής αναφορά: είστε προστατευμένοι, είστε εκτεθειμένοι, ή υπάρχει ήδη σύγκρουση. Με προτάσεις επόμενων βημάτων.</p>
      </div>
    </div>
  </div>
</section>

<!-- TRUST / QUOTE -->
<section class="trust">
  <div class="container trust-quote">
    <blockquote>«Νόμιζα ότι η καταχώρηση στη ΓΕΜΗ με προστατεύει. Ανακάλυψα ότι κάποιος στη Θεσσαλονίκη είχε ήδη δηλώσει το όνομά μου στον ΟΒΙ. Το BrandGuard με βοήθησε να το μάθω πριν ανοίξω το δεύτερο κατάστημα.»</blockquote>
    <p class="trust-author"><strong>Μαρία Π.</strong> · Ιδιοκτήτρια καφέ, Αθήνα</p>
  </div>
</section>

<!-- PRICING -->
<section class="pricing" id="pricing">
  <div class="container">
    <div class="section-label">Τιμοκατάλογος</div>
    <h2 class="section-title">Ξεκάθαρες τιμές. Χωρίς κρυφές χρεώσεις.</h2>
    <p class="section-sub">Ξεκινήστε με τον έλεγχο για μόνο €9. Αν θέλετε κατοχύρωση ή συνεχή παρακολούθηση, επιλέγετε το πακέτο που σας ταιριάζει.</p>
    <div class="pricing-grid">
      <div class="price-card">
        <div class="price-name">Έλεγχος Σήματος</div>
        <div class="price-amt">€9</div>
        <p class="price-desc">Βασική αναφορά κινδύνου για ένα brand σε έναν κλάδο.</p>
        <ul class="price-feats">
          <li>Έλεγχος OBI (Ελλάδα)</li>
          <li>Έλεγχος EUIPO (ΕΕ)</li>
          <li>Αποτέλεσμα εντός 48 ωρών</li>
          <li>Γραπτή αναφορά σε PDF</li>
        </ul>
        <a href="#check" class="price-cta">Ξεκινήστε τον έλεγχο →</a>
      </div>

      <div class="price-card featured">
        <div class="featured-badge">BEST VALUE</div>
        <div class="price-name">Filing Kit</div>
        <div class="price-amt">€59<span class="per"> / one-time</span></div>
        <p class="price-desc">Πλήρες πακέτο κατοχύρωσης. Παραδοτέο έτοιμο για υποβολή στον ΟΒΙ.</p>
        <ul class="price-feats">
          <li>Όλα του ελέγχου σήματος</li>
          <li>Προκαταρκτική έρευνα παρομοιότητας</li>
          <li>Συμπληρωμένο έντυπο ΟΒΙ</li>
          <li>Οδηγίες υποβολής step-by-step</li>
          <li>Email support 30 ημερών</li>
          <li>Επιλογή NICE class</li>
        </ul>
        <a href="/payment?product=kit" class="price-cta">Αγορά Filing Kit →</a>
      </div>

      <div class="price-card">
        <div class="price-name">Monitoring</div>
        <div class="price-amt">€99<span class="per"> / έτος</span></div>
        <p class="price-desc">Συνεχής παρακολούθηση νέων καταχωρήσεων που μπορεί να απειλήσουν το brand σας.</p>
        <ul class="price-feats">
          <li>Εβδομαδιαίος έλεγχος OBI + EUIPO</li>
          <li>Άμεση ειδοποίηση για συγκρούσεις</li>
          <li>Προτάσεις ενεργειών ανά alert</li>
          <li>Μηνιαία αναφορά status</li>
          <li>Ακύρωση ανά πάσα στιγμή</li>
        </ul>
        <a href="/payment?product=monitoring" class="price-cta">Ξεκινήστε monitoring →</a>
      </div>
    </div>

    <p style="text-align:center;margin-top:40px;font-size:14px;color:#64748b">
      💡 Ο αναλυτικός <strong style="color:#0f172a">€29 Risk Report</strong> διατίθεται επίσης — <a href="/payment?product=report" style="color:#e11d48;font-weight:600">αγοράστε εδώ</a>.
    </p>
  </div>
</section>

<!-- FAQ -->
<section id="faq">
  <div class="container">
    <div class="section-label">FAQ</div>
    <h2 class="section-title">Συχνές ερωτήσεις</h2>
    <div class="faq-list">
      <details>
        <summary>Είμαι καταχωρημένος στη ΓΕΜΗ — δεν είμαι προστατευμένος;</summary>
        <p>Όχι. Η ΓΕΜΗ είναι μητρώο εταιρειών — αφορά το νομικό πρόσωπο, όχι το brand. Η κατοχύρωση του εμπορικού σήματος γίνεται στον ΟΒΙ και είναι εντελώς ξεχωριστή διαδικασία. Είναι πολύ συχνό μία εταιρεία να είναι νόμιμα εγγεγραμμένη στη ΓΕΜΗ και ταυτόχρονα να έχει τελείως απροστάτευτο το brand της.</p>
      </details>
      <details>
        <summary>Τι σημαίνει «first-to-file» στην Ελλάδα;</summary>
        <p>Σημαίνει ότι τα δικαιώματα στο εμπορικό σήμα αποκτά όποιος το δηλώσει πρώτος στον ΟΒΙ — όχι όποιος το χρησιμοποιεί πρώτος στην πράξη. Αυτό ισχύει σχεδόν σε όλη την ΕΕ. Έτσι, ακόμα και αν το καφέ σας λειτουργεί 15 χρόνια, κάποιος μπορεί να το δηλώσει σήμερα και να έχει νομικό δικαίωμα να σας ζητήσει να αλλάξετε όνομα.</p>
      </details>
      <details>
        <summary>Ο έλεγχός σας είναι νομική συμβουλή;</summary>
        <p>Όχι. Το BrandGuard παρέχει ενημερωτική αναφορά βασισμένη σε δημόσια διαθέσιμα δεδομένα από OBI, EUIPO και TMview. Για οριστικές νομικές κρίσεις συνιστούμε συνεργασία με δικηγόρο εξειδικευμένο σε IP — σας συνδέουμε με δικό μας δίκτυο αν χρειαστεί.</p>
      </details>
      <details>
        <summary>Πόσο κοστίζει η επίσημη κατοχύρωση στον ΟΒΙ;</summary>
        <p>Τα τέλη ΟΒΙ ξεκινούν από περίπου €110 για μία κλάση προϊόντων/υπηρεσιών. Το δικό μας Filing Kit (€59) σας προετοιμάζει τα πάντα για να κάνετε την υποβολή χωρίς να χρειαστεί δικηγόρος. Συνολικό κόστος: περίπου €169 για ένα πλήρως κατοχυρωμένο ελληνικό σήμα.</p>
      </details>
      <details>
        <summary>Γιατί να μην πάω απευθείας σε δικηγόρο;</summary>
        <p>Μπορείτε. Η μέση αμοιβή για κατοχύρωση εμπορικού σήματος στην Ελλάδα ξεκινά από €350–600 ανά κλάση. Το BrandGuard σας δίνει την ίδια τεχνική δουλειά (έρευνα παρομοιότητας, συμπλήρωση εντύπων) στο 20% του κόστους — ιδανικό για SMBs που θέλουν προστασία χωρίς να σπαταλούν στον legal retainer.</p>
      </details>
      <details>
        <summary>Αν βρεθεί σύγκρουση, τι κάνω;</summary>
        <p>Η αναφορά μας δείχνει ποιο είναι το ακριβές conflict mark, ποιος το δηλώνει, και σε ποια κλάση. Με αυτά τα δεδομένα μπορείτε: (α) να αλλάξετε brand πριν επενδύσετε περισσότερο, (β) να επικοινωνήσετε με τον κάτοχο για χρήση με άδεια, (γ) να προσφύγετε με νομική βοήθεια αν πιστεύετε ότι έχετε προηγούμενα δικαιώματα. Προτείνουμε το κατάλληλο βήμα για κάθε περίπτωση.</p>
      </details>
      <details>
        <summary>Πόσος χρόνος χρειάζεται για να κατοχυρωθεί ένα σήμα;</summary>
        <p>Από την υποβολή στον ΟΒΙ μέχρι την πλήρη κατοχύρωση συνήθως 4–6 μήνες (αν δεν υπάρξουν ενστάσεις). Αλλά από τη στιγμή υποβολής, έχετε ήδη προτεραιότητα — κανείς δεν μπορεί να καταχωρήσει το ίδιο σήμα αργότερα.</p>
      </details>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="final-cta">
  <h2>Μάθετε σε 48 ώρες αν το brand σας είναι ασφαλές</h2>
  <p>Πλήρης αναφορά κινδύνου για ελληνικές επιχειρήσεις — μόνο €9.</p>
  <a href="#check" class="btn">Ξεκινήστε τον έλεγχο — €9 →</a>
</section>

<footer>
  <div class="container">
    <div class="footer-copy">© 2026 BrandGuard · <strong>Agentis Venture Studio</strong></div>
    <div class="footer-links">
      <a href="/privacy">Πολιτική Απορρήτου</a>
      <a href="/terms">Όροι Χρήσης</a>
      <a href="/how-it-works">Πώς λειτουργεί</a>
      <a href="/pricing">Τιμές</a>
      <a href="/partner">Partners</a>
      <a href="mailto:hello@brandguard.gr">Επικοινωνία</a>
    </div>
  </div>
</footer>

<script>
  (function(){
    // Capture UTM / ref params from URL into the hidden form fields for attribution tracking.
    var qs = new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','ref'].forEach(function(k){
      var el = document.getElementById(k);
      var v = qs.get(k);
      if (el && v) el.value = v;
    });
  })();
</script>

</body>
</html>`;
}

function thankYouHTML(businessName) {
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrandGuard — Ευχαριστούμε · Αίτημα ελέγχου ληφθέν</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:#fafbfc;color:#0f172a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:48px;max-width:540px;text-align:center;box-shadow:0 20px 60px -20px rgba(15,23,42,0.15)}
    .icon{font-size:56px;margin-bottom:20px}
    h2{font-size:28px;font-weight:800;margin-bottom:12px;letter-spacing:-0.5px}
    p{color:#475569;line-height:1.65;margin-bottom:16px}
    .next{background:#fef2f2;border-radius:10px;padding:20px;margin-top:24px;text-align:left}
    .next strong{color:#e11d48;display:block;margin-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:1px}
    .next ul{margin-left:20px;margin-top:10px;color:#475569;font-size:14px;line-height:1.8}
    a.btn{display:inline-block;margin-top:24px;padding:14px 28px;background:#0f172a;color:#fff;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px}
    a.btn:hover{background:#e11d48}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h2>Ευχαριστούμε!</h2>
    <p>Λάβαμε το αίτημά σας για <strong style="color:#0f172a">${businessName}</strong>. Η ομάδα μας ελέγχει ήδη τα μητρώα OBI και EUIPO.</p>
    <div class="next">
      <strong>Τι συμβαίνει τώρα:</strong>
      <ul>
        <li>Εντός 48 ωρών θα λάβετε πλήρη αναφορά στο email σας.</li>
        <li>Αν βρεθεί σύγκρουση, θα σας προτείνουμε συγκεκριμένα επόμενα βήματα.</li>
        <li>Αν είστε «καθαροί», θα σας ενημερώσουμε πώς να κατοχυρώσετε το brand σας ώστε να μην το χάσετε ποτέ.</li>
      </ul>
    </div>
    <p style="margin-top:24px;font-size:14px;color:#94a3b8">Σε περίπτωση που χρειαστεί να επικοινωνήσετε άμεσα: <a href="mailto:hello@brandguard.gr" style="color:#e11d48;font-weight:600">hello@brandguard.gr</a></p>
    <a href="/" class="btn">← Επιστροφή στην αρχική</a>
  </div>
</body>
</html>`;
}

function paymentPageHTML(product, leadId) {
  const products = {
    check: { name: 'BrandGuard Trademark Check', price: '€9', description: 'Έλεγχος OBI + EUIPO. Γραπτή αναφορά κινδύνου εντός 48 ωρών.' },
    report: { name: 'BrandGuard Risk Report', price: '€29', description: 'Λεπτομερής έκθεση κινδύνου με OBI + EUIPO + TMview cross-check.' },
    kit: { name: 'BrandGuard Filing Kit', price: '€59', description: 'Πλήρες kit κατοχύρωσης — έτοιμο για υποβολή στον ΟΒΙ.' },
    monitoring: { name: 'BrandGuard Monitoring', price: '€99/έτος', description: 'Εβδομαδιαία παρακολούθηση νέων καταχωρήσεων που απειλούν το brand σας.' },
  };
  const p = products[product] || products['report'];
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>BrandGuard — ${p.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:#fafbfc;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:40px;max-width:440px;text-align:center;box-shadow:0 20px 60px -20px rgba(15,23,42,0.15)}
    h2{font-size:24px;font-weight:800;color:#0f172a;margin-bottom:8px;letter-spacing:-0.5px}
    .price{font-size:56px;font-weight:800;color:#e11d48;margin:20px 0;letter-spacing:-2px;line-height:1}
    p{color:#475569;line-height:1.6;margin-bottom:28px}
    a.btn{display:block;padding:15px;background:#0f172a;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;transition:background 0.15s}
    a.btn:hover{background:#e11d48}
    .secure{margin-top:18px;font-size:13px;color:#94a3b8;display:flex;align-items:center;justify-content:center;gap:6px}
    .back{display:block;margin-top:18px;font-size:14px;color:#64748b;text-decoration:none}
    .back:hover{color:#0f172a}
  </style>
</head>
<body>
  <div class="card">
    <h2>${p.name}</h2>
    <div class="price">${p.price}</div>
    <p>${p.description}</p>
    <a class="btn" href="/create-checkout?product=${product}&lead_id=${leadId}">Πληρωμή με κάρτα →</a>
    <div class="secure">🔒 Ασφαλής πληρωμή μέσω Stripe</div>
    <a href="/" class="back">← Επιστροφή</a>
  </div>
</body>
</html>`;
}

module.exports = { landingPageHTML, thankYouHTML, paymentPageHTML };
