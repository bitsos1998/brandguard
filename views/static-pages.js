// Static content pages — shares nav + footer + styling with landing page.

const SHARED_HEAD = `
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:#fafbfc;color:#0f172a;line-height:1.7;-webkit-font-smoothing:antialiased}
    a{color:#e11d48;text-decoration:none}
    a:hover{text-decoration:underline}
    nav.topnav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #e5e7eb}
    .nav-inner{max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
    .logo{font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;display:flex;align-items:center;gap:8px;text-decoration:none}
    .logo:hover{text-decoration:none}
    .logo-dot{width:10px;height:10px;border-radius:50%;background:#e11d48}
    .nav-links{display:flex;gap:28px;font-size:14px;font-weight:500;color:#475569}
    .nav-links a{color:#475569}
    .nav-links a:hover{color:#0f172a;text-decoration:none}
    .nav-cta{background:#0f172a;color:#fff;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:600}
    .nav-cta:hover{background:#1e293b;text-decoration:none;color:#fff}
    @media(max-width:640px){.nav-links{display:none}}

    .page{max-width:760px;margin:0 auto;padding:60px 24px 80px}
    .page-label{font-size:13px;font-weight:700;color:#e11d48;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
    .page h1{font-size:44px;font-weight:800;letter-spacing:-1.2px;line-height:1.1;margin-bottom:20px;color:#0f172a}
    .page .lead{font-size:19px;color:#475569;margin-bottom:40px;line-height:1.55}
    .page h2{font-size:24px;font-weight:700;margin-top:40px;margin-bottom:12px;color:#0f172a;letter-spacing:-0.3px}
    .page h3{font-size:18px;font-weight:600;margin-top:24px;margin-bottom:8px;color:#0f172a}
    .page p{color:#334155;margin-bottom:16px;font-size:16px}
    .page ul{margin:16px 0 16px 24px;color:#334155}
    .page li{padding:4px 0}
    .page .callout{background:#fef2f2;border-left:4px solid #e11d48;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;font-size:15px;color:#7f1d1d}
    .page .callout strong{color:#9f1239}

    footer{background:#fff;border-top:1px solid #e5e7eb;padding:40px 24px;margin-top:60px}
    footer .container{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:13px;color:#64748b}
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

const PAGES = {
  'how-it-works': {
    title: 'Πώς λειτουργεί το BrandGuard',
    description: 'Η διαδικασία ελέγχου και κατοχύρωσης εμπορικού σήματος για ελληνικές επιχειρήσεις σε 3 βήματα.',
    label: 'Η διαδικασία',
    h1: 'Πώς λειτουργεί',
    lead: 'Ο στόχος μας είναι απλός: να σας πούμε σε 48 ώρες αν το brand σας κινδυνεύει — και πώς να το προστατέψετε.',
    body: `
      <h2>1. Ζητάτε έλεγχο (€9)</h2>
      <p>Συμπληρώνετε μια σύντομη φόρμα με το όνομα της επιχείρησής σας, τον κλάδο και την πόλη. Πληρωμή €9 μέσω Stripe — ασφαλής και άμεση.</p>

      <h2>2. Εκτελούμε τον έλεγχο</h2>
      <p>Η ομάδα μας ψάχνει:</p>
      <ul>
        <li><strong>Στον ΟΒΙ</strong> (Οργανισμός Βιομηχανικής Ιδιοκτησίας) — για καταχωρημένα ελληνικά σήματα.</li>
        <li><strong>Στο EUIPO</strong> (Γραφείο Διανοητικής Ιδιοκτησίας της ΕΕ) — για σήματα που ισχύουν σε όλη την ΕΕ.</li>
        <li><strong>Στο TMview</strong> — για συγκεντρωτικά δεδομένα από όλες τις εθνικές υπηρεσίες της ΕΕ.</li>
      </ul>
      <p>Εξετάζουμε όχι μόνο ακριβείς αντιστοιχίες αλλά και παρόμοια σήματα που θα μπορούσαν να δημιουργήσουν σύγχυση — με βάση την κατηγοριοποίηση της Νίκαιας (Nice classification).</p>

      <h2>3. Λαμβάνετε την αναφορά</h2>
      <p>Εντός 48 ωρών σας στέλνουμε γραπτή αναφορά σε PDF που περιλαμβάνει:</p>
      <ul>
        <li>Εάν το όνομά σας είναι ήδη κατοχυρωμένο (από εσάς ή κάποιον άλλο).</li>
        <li>Εάν υπάρχουν παρόμοια σήματα που μπορεί να σας δημιουργήσουν πρόβλημα.</li>
        <li>Εκτίμηση του επιπέδου κινδύνου (χαμηλός / μέτριος / υψηλός).</li>
        <li>Προτεινόμενα επόμενα βήματα.</li>
      </ul>

      <h2>Τι γίνεται μετά;</h2>
      <p>Αν βρούμε ότι είστε καθαροί, μπορείτε να προχωρήσετε σε κατοχύρωση με το <strong>Filing Kit (€59)</strong> ή να βάλετε το brand σας σε <strong>Monitoring (€99/έτος)</strong> για συνεχή παρακολούθηση. Αν υπάρχει σύγκρουση, η αναφορά μας σας λέει ακριβώς με ποιον πρέπει να μιλήσετε και γιατί.</p>

      <div class="callout">
        <strong>Σημαντικό:</strong> Η αναφορά μας είναι ενημερωτικού χαρακτήρα. Για οριστικές νομικές κρίσεις σε σύνθετες υποθέσεις, συνιστούμε συνεργασία με δικηγόρο εξειδικευμένο σε IP. Μπορούμε να σας συνδέσουμε με δικό μας δίκτυο αν το ζητήσετε.
      </div>
    `,
  },

  pricing: {
    title: 'Τιμές BrandGuard — Ξεκάθαρες, χωρίς κρυφές χρεώσεις',
    description: 'Τιμοκατάλογος υπηρεσιών BrandGuard: Έλεγχος Σήματος €9, Filing Kit €59, Monitoring €99/έτος.',
    label: 'Τιμοκατάλογος',
    h1: 'Τιμές',
    lead: 'Ξεκινήστε με τον έλεγχο σήματος για μόνο €9. Αν θέλετε κατοχύρωση ή συνεχή παρακολούθηση, επιλέγετε το πακέτο που σας ταιριάζει.',
    body: `
      <h2>Έλεγχος Σήματος — €9</h2>
      <p>Βασική αναφορά κινδύνου για ένα brand. Περιλαμβάνει:</p>
      <ul>
        <li>Αναζήτηση στον ΟΒΙ (εθνικό σύστημα).</li>
        <li>Αναζήτηση στο EUIPO (ΕΕ).</li>
        <li>Γραπτή αναφορά σε PDF εντός 48 ωρών.</li>
        <li>Προτάσεις επόμενων βημάτων.</li>
      </ul>
      <p><strong>Για ποιον:</strong> Κάθε επιχείρηση που ξεκινάει ή θέλει μια πρώτη εικόνα του κινδύνου.</p>

      <h2>Risk Report — €29</h2>
      <p>Αναβαθμισμένη αναφορά για όσους θέλουν βαθύτερη ανάλυση:</p>
      <ul>
        <li>Όλα του δωρεάν ελέγχου.</li>
        <li>Cross-check με TMview για σήματα σε όλη την ΕΕ.</li>
        <li>Ανάλυση παρομοιότητας (όχι μόνο ακριβής ταύτιση).</li>
        <li>Εκτίμηση κόστους πιθανής διαμάχης.</li>
        <li>Συστάσεις ανά κλάση NICE.</li>
      </ul>
      <p><strong>Για ποιον:</strong> Επιχειρήσεις που σκέφτονται επέκταση ή franchise.</p>

      <h2>Filing Kit — €59 (best value)</h2>
      <p>Πλήρες πακέτο κατοχύρωσης εμπορικού σήματος στον ΟΒΙ:</p>
      <ul>
        <li>Προκαταρκτική έρευνα παρομοιότητας.</li>
        <li>Συμπληρωμένο έντυπο ΟΒΙ έτοιμο για υποβολή.</li>
        <li>Οδηγίες βήμα-βήμα για την υποβολή.</li>
        <li>Επιλογή κατάλληλων κλάσεων NICE.</li>
        <li>Email support για 30 ημέρες.</li>
      </ul>
      <p><strong>Επιπλέον κόστος ΟΒΙ:</strong> Τα τέλη υποβολής ξεκινούν από ~€110 για μία κλάση και πηγαίνουν απευθείας στον ΟΒΙ — δεν τα χρεώνουμε εμείς.</p>
      <p><strong>Για ποιον:</strong> Επιχειρήσεις έτοιμες να κατοχυρώσουν το brand τους χωρίς να πληρώσουν €500+ σε δικηγόρο.</p>

      <h2>Monitoring — €99/έτος</h2>
      <p>Συνεχής παρακολούθηση για να μην σας προλάβει κανείς:</p>
      <ul>
        <li>Εβδομαδιαίος έλεγχος OBI + EUIPO.</li>
        <li>Άμεση ειδοποίηση αν εμφανιστεί παρόμοιο σήμα.</li>
        <li>Προτεινόμενες ενέργειες για κάθε alert.</li>
        <li>Μηνιαία αναφορά status.</li>
        <li>Ακύρωση ανά πάσα στιγμή.</li>
      </ul>
      <p><strong>Για ποιον:</strong> Κατοχυρωμένα brands που θέλουν να αντιδρούν γρήγορα σε απειλές.</p>

      <div class="callout">
        <strong>Bundle deal:</strong> Filing Kit + Monitoring για 1 έτος = €129 (εξοικονομείτε €29). Επικοινωνήστε στο hello@brandguard.gr.
      </div>
    `,
  },

  faq: {
    title: 'Συχνές Ερωτήσεις — BrandGuard',
    description: 'Απαντήσεις στις συχνότερες ερωτήσεις για την κατοχύρωση εμπορικού σήματος στην Ελλάδα.',
    label: 'FAQ',
    h1: 'Συχνές ερωτήσεις',
    lead: 'Ό,τι χρειάζεται να ξέρετε για την κατοχύρωση εμπορικού σήματος στην Ελλάδα.',
    body: `
      <h2>Βασικά</h2>
      <h3>Τι είναι το εμπορικό σήμα (trademark);</h3>
      <p>Το εμπορικό σήμα είναι το νομικά προστατευμένο όνομα, λογότυπο ή σύμβολο που χρησιμοποιείτε στην αγορά. Σας δίνει το αποκλειστικό δικαίωμα να εμποδίσετε άλλους να χρησιμοποιήσουν το ίδιο ή παρόμοιο σημάδι στον ίδιο κλάδο.</p>

      <h3>Χρειάζομαι δικηγόρο για κατοχύρωση;</h3>
      <p>Όχι υποχρεωτικά. Μπορείτε να καταθέσετε μόνοι σας την αίτηση στον ΟΒΙ. Το Filing Kit του BrandGuard σας προετοιμάζει τα πάντα ώστε να κάνετε την υποβολή χωρίς νομική βοήθεια. Δικηγόρος είναι απαραίτητος μόνο σε περίπτωση ενστάσεων ή σύνθετων υποθέσεων.</p>

      <h3>Πόσο κοστίζει τελικά η κατοχύρωση;</h3>
      <p>Τέλη ΟΒΙ για μία κλάση: περίπου €110. Επιπλέον κλάσεις: ~€20 καθεμία. Με το Filing Kit μας (€59) το σύνολο για ένα πλήρως κατοχυρωμένο σήμα ξεκινάει από ~€169.</p>

      <h2>Νομικά</h2>
      <h3>Ισχύει ο κανόνας «first-to-file» στην Ελλάδα;</h3>
      <p>Ναι. Τα δικαιώματα στο σήμα αποκτά όποιος το δηλώσει πρώτος στον ΟΒΙ. Το ότι χρησιμοποιείτε το όνομα από καιρό δεν δίνει αυτόματη προστασία στα περισσότερα σενάρια.</p>

      <h3>Η ΓΕΜΗ με προστατεύει;</h3>
      <p>Όχι. Η ΓΕΜΗ είναι μητρώο εταιρειών — δεν προστατεύει το brand σας. Η κατοχύρωση σήματος γίνεται αποκλειστικά στον ΟΒΙ.</p>

      <h3>Η κατοχύρωση στον ΟΒΙ ισχύει σε όλη την ΕΕ;</h3>
      <p>Όχι. Το ελληνικό σήμα ισχύει μόνο στην Ελλάδα. Για προστασία σε όλη την ΕΕ χρειάζεστε σήμα EUIPO (~€850 για μία κλάση). Αν δραστηριοποιείστε μόνο στην Ελλάδα, το εθνικό σήμα είναι συνήθως αρκετό.</p>

      <h2>Τεχνικά</h2>
      <h3>Πόσος χρόνος χρειάζεται για να κατοχυρωθεί το σήμα;</h3>
      <p>Από υποβολή μέχρι πλήρη κατοχύρωση: 4–6 μήνες αν δεν υπάρξουν ενστάσεις. Αλλά από τη στιγμή υποβολής έχετε προτεραιότητα — κανείς δεν μπορεί να καταθέσει το ίδιο μετά από εσάς.</p>

      <h3>Μπορώ να κατοχυρώσω ένα περιγραφικό όνομα (π.χ. «Φρέσκο Ψωμί»);</h3>
      <p>Πολύ δύσκολα. Ο ΟΒΙ και το EUIPO συνήθως απορρίπτουν σήματα που περιγράφουν απλώς το προϊόν. Τα πιο ισχυρά σήματα είναι fanciful (π.χ. «Αρτέμιδα») ή suggestive (π.χ. «Λευκή Φουρνάρισσα»).</p>

      <h3>Τι γίνεται αν κάποιος ήδη έχει το όνομά μου;</h3>
      <p>Έχετε τρεις επιλογές: (α) αλλάξετε brand, (β) διαπραγματευτείτε άδεια χρήσης ή εξαγορά, (γ) αν πιστεύετε ότι έχετε προηγούμενα δικαιώματα από τη μακροχρόνια χρήση, μπορείτε να προσφύγετε — σε αυτή την περίπτωση χρειάζεστε εξειδικευμένο δικηγόρο.</p>

      <h2>BrandGuard</h2>
      <h3>Είναι το BrandGuard νομική υπηρεσία;</h3>
      <p>Όχι. Είμαστε υπηρεσία πληροφόρησης και τεχνικής προετοιμασίας. Δεν παρέχουμε νομική εκπροσώπηση. Οι αναφορές μας είναι ενημερωτικές.</p>

      <h3>Πώς διαφέρετε από άλλες υπηρεσίες;</h3>
      <p>Εστιάζουμε αποκλειστικά στην ελληνική αγορά — γνωρίζουμε τα particulars του ΟΒΙ και τις συνήθειες του HDPA. Οι περισσότερες διεθνείς υπηρεσίες (LegalZoom κ.λπ.) δεν έχουν ιδέα για τον ΟΒΙ.</p>
    `,
  },

  privacy: {
    title: 'Πολιτική Απορρήτου — BrandGuard',
    description: 'Πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα.',
    label: 'Νομικά',
    h1: 'Πολιτική Απορρήτου',
    lead: 'Ενημερώθηκε τελευταία φορά στις 15 Απριλίου 2026. Η χρήση του brandguard.gr συνεπάγεται αποδοχή της παρούσας πολιτικής.',
    body: `
      <h2>1. Ποιοι είμαστε</h2>
      <p>Το BrandGuard λειτουργεί από την <strong>Agentis Venture Studio</strong>, με έδρα στην Ελλάδα. Για επικοινωνία σχετικά με προσωπικά δεδομένα: <a href="mailto:hello@agentis.gr">hello@agentis.gr</a>.</p>

      <h2>2. Τι δεδομένα συλλέγουμε</h2>
      <h3>Δεδομένα που μας δίνετε εσείς</h3>
      <ul>
        <li>Όνομα επιχείρησης, προσωπικό όνομα, email, πόλη, κλάδος (μέσω της φόρμας ελέγχου).</li>
        <li>Στοιχεία πληρωμής (επεξεργάζονται αποκλειστικά από Stripe — δεν τα αποθηκεύουμε εμείς).</li>
      </ul>
      <h3>Δεδομένα από δημόσιες πηγές</h3>
      <ul>
        <li>Πληροφορίες επιχείρησης από ΓΕΜΗ, Google Places, δημόσιους εταιρικούς ιστότοπους — για σκοπούς outbound επικοινωνίας βάσει <strong>έννομου συμφέροντος (Άρθρο 6 παρ. 1 στ' GDPR)</strong>.</li>
      </ul>

      <h2>3. Πώς χρησιμοποιούμε τα δεδομένα</h2>
      <ul>
        <li>Για να απαντήσουμε στο αίτημά σας για έλεγχο σήματος.</li>
        <li>Για να σας στείλουμε την αναφορά που ζητήσατε.</li>
        <li>Για επακόλουθη επικοινωνία που αφορά την υπηρεσία.</li>
        <li>Για outbound επικοινωνία προς επιχειρήσεις — <strong>με πάντοτε δυνατότητα άμεσης διαγραφής</strong>.</li>
      </ul>

      <h2>4. Ποιος έχει πρόσβαση</h2>
      <p>Τα δεδομένα σας αποθηκεύονται σε υποδομή Railway (EU region όπου είναι δυνατόν) και δεν μοιράζονται με τρίτους παρά μόνο με:</p>
      <ul>
        <li><strong>SendGrid</strong> — για αποστολή email.</li>
        <li><strong>Stripe</strong> — για επεξεργασία πληρωμών.</li>
        <li><strong>Anthropic</strong> (Claude API) — για παραγωγή περιεχομένου (το business name σας περνά από εκεί αλλά δεν αποθηκεύεται).</li>
      </ul>

      <h2>5. Τα δικαιώματά σας (GDPR)</h2>
      <ul>
        <li><strong>Πρόσβαση:</strong> μπορείτε να ζητήσετε τι δεδομένα έχουμε για εσάς.</li>
        <li><strong>Διόρθωση:</strong> να διορθώσουμε λανθασμένες πληροφορίες.</li>
        <li><strong>Διαγραφή:</strong> να διαγράψουμε όλα τα δεδομένα σας (μέσω του unsubscribe link ή στο hello@agentis.gr).</li>
        <li><strong>Φορητότητα:</strong> να λάβετε αντίγραφο σε μηχαναγνώσιμη μορφή.</li>
        <li><strong>Αντίρρηση:</strong> να σταματήσουμε τη χρήση των δεδομένων σας για συγκεκριμένους σκοπούς.</li>
      </ul>

      <h2>6. Αρχή Προστασίας Δεδομένων</h2>
      <p>Έχετε δικαίωμα να υποβάλετε καταγγελία στην <strong>Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (HDPA)</strong>: <a href="https://www.dpa.gr" target="_blank" rel="noopener">dpa.gr</a>.</p>

      <h2>7. Cookies</h2>
      <p>Χρησιμοποιούμε μόνο τεχνικά απαραίτητα cookies για λειτουργία του admin (login session). Δεν τρέχουμε tracking cookies, δεν έχουμε third-party analytics.</p>

      <h2>8. Αλλαγές</h2>
      <p>Θα σας ενημερώνουμε για ουσιαστικές αλλαγές στην πολιτική. Η παρούσα έκδοση ισχύει από 15/04/2026.</p>
    `,
  },

  terms: {
    title: 'Όροι Χρήσης — BrandGuard',
    description: 'Όροι και προϋποθέσεις χρήσης των υπηρεσιών BrandGuard.',
    label: 'Νομικά',
    h1: 'Όροι Χρήσης',
    lead: 'Ενημερώθηκε τελευταία φορά στις 15 Απριλίου 2026.',
    body: `
      <h2>1. Αποδοχή των όρων</h2>
      <p>Η χρήση του brandguard.gr και των υπηρεσιών του συνεπάγεται ανεπιφύλακτη αποδοχή των παρόντων όρων.</p>

      <h2>2. Φύση της υπηρεσίας</h2>
      <p>Το BrandGuard παρέχει <strong>ενημερωτικές αναφορές</strong> βασισμένες σε δημόσια διαθέσιμα δεδομένα από OBI, EUIPO και TMview. <strong>Δεν αποτελεί νομική συμβουλή ή υπηρεσία νομικής εκπροσώπησης.</strong></p>

      <h2>3. Περιορισμός ευθύνης</h2>
      <p>Οι αναφορές μας βασίζονται σε δεδομένα που είναι διαθέσιμα τη στιγμή της έρευνας. Δεν εγγυόμαστε ότι:</p>
      <ul>
        <li>Όλες οι υπάρχουσες καταχωρήσεις θα εντοπιστούν (μπορεί να υπάρχει lag μεταξύ OBI και TMview).</li>
        <li>Η αναφορά θα αποτρέψει μελλοντικές συγκρούσεις.</li>
        <li>Μελλοντικές ενέργειες τρίτων δεν θα επηρεάσουν το brand σας.</li>
      </ul>
      <p>Η μέγιστη ευθύνη μας σε κάθε περίπτωση περιορίζεται στο ποσό που έχετε καταβάλει για τη συγκεκριμένη υπηρεσία.</p>

      <h2>4. Πληρωμές και επιστροφές</h2>
      <ul>
        <li>Πληρωμές γίνονται μέσω Stripe (ασφαλής επεξεργασία).</li>
        <li>Το Risk Report και το Filing Kit: επιστροφή χρημάτων εντός 14 ημερών αν δεν έχει ξεκινήσει η εκτέλεση.</li>
        <li>Το Monitoring: pro-rata επιστροφή για τον υπόλοιπο χρόνο αν ακυρώσετε.</li>
      </ul>

      <h2>5. Πνευματική ιδιοκτησία</h2>
      <p>Το περιεχόμενο του brandguard.gr (κείμενα, γραφικά, λογότυπα) ανήκει στην Agentis Venture Studio. Απαγορεύεται η αναπαραγωγή χωρίς άδεια.</p>

      <h2>6. Τροποποιήσεις</h2>
      <p>Διατηρούμε το δικαίωμα να τροποποιήσουμε τους παρόντες όρους. Θα σας ενημερώσουμε για ουσιαστικές αλλαγές.</p>

      <h2>7. Εφαρμοστέο δίκαιο</h2>
      <p>Οι παρόντες όροι διέπονται από το ελληνικό δίκαιο. Αρμόδια δικαστήρια είναι τα δικαστήρια της Αθήνας.</p>

      <h2>8. Επικοινωνία</h2>
      <p>Για οποιαδήποτε ερώτηση σχετικά με τους όρους: <a href="mailto:hello@brandguard.gr">hello@brandguard.gr</a></p>
    `,
  },

  partner: {
    title: 'Partner Program — BrandGuard για λογιστές & συμβούλους',
    description: 'Κερδίστε €12 για κάθε πελάτη που παραπέμπετε στο BrandGuard. Ιδανικό για λογιστές, συμβούλους, web designers.',
    label: 'Partnership',
    h1: 'Κερδίστε €12 για κάθε πελάτη που παραπέμπετε',
    lead: 'Αν συνεργάζεστε συστηματικά με επιχειρήσεις — ως λογιστής, σύμβουλος, δικηγόρος, ή web designer — το BrandGuard Partner Program σας δίνει εισόδημα από κάτι που ήδη κάνετε.',
    body: `
      <h2>Πώς λειτουργεί</h2>
      <ol>
        <li><strong>Γραφτείτε στο πρόγραμμα.</strong> Στέλνετε ένα email στο partner@brandguard.gr με το όνομά σας, την εταιρεία σας, και 1 πρόταση για τη δραστηριότητά σας.</li>
        <li><strong>Λαμβάνετε τον μοναδικό σας κωδικό.</strong> Για παράδειγμα: <code>ref=accountantmaria</code>.</li>
        <li><strong>Παραπέμπετε πελάτες.</strong> Οποτεδήποτε μιλάτε με επιχείρηση που χρειάζεται trademark check, τους στέλνετε τον σύνδεσμο <code>brandguard.gr?ref=accountantmaria</code>.</li>
        <li><strong>Παρακολουθείτε online.</strong> Στο dashboard σας βλέπετε πόσοι ήρθαν από τον κωδικό σας και πόσοι πλήρωσαν.</li>
        <li><strong>Πληρώνεστε κάθε μήνα.</strong> Για κάθε Filing Kit (€59) που αγόρασε κάποιος με τον κωδικό σας, κερδίζετε <strong>€12</strong>. Για κάθε Monitoring subscription (€99/έτος) που ανανεώνεται, κερδίζετε <strong>€20/έτος</strong>.</li>
      </ol>

      <h2>Γιατί αξίζει</h2>
      <p>Ο μέσος όρος για λογιστή στην Αθήνα είναι ~80 ενεργοί πελάτες-επιχειρήσεις. Αν το 20% αγοράσει Filing Kit το πρώτο έτος, αυτό είναι 16 conversions × €12 = <strong>€192 καθαρό εισόδημα τον χρόνο από κάτι που ήδη συζητάτε</strong>.</p>
      <p>Αν 10 από αυτούς κρατήσουν και Monitoring, είναι επιπλέον €200/έτος σε recurring revenue.</p>

      <h2>Ποιους αναζητάμε</h2>
      <ul>
        <li><strong>Λογιστές</strong> που εξυπηρετούν SMBs (όλοι έχουν αυτή τη συζήτηση με πελάτες).</li>
        <li><strong>Web designers / studios</strong> που φτιάχνουν brand identity για νέες επιχειρήσεις.</li>
        <li><strong>Συμβούλους επιχειρήσεων</strong> που βοηθούν σε launch ή expansion.</li>
        <li><strong>Δικηγόρους</strong> που δεν κάνουν IP αλλά έχουν πελάτες που χρειάζονται trademark.</li>
        <li><strong>Επιμελητήρια και associations</strong> που μπορούν να μας συστήσουν επίσημα στα μέλη τους.</li>
      </ul>

      <h2>Τι παίρνουν οι πελάτες σας</h2>
      <p>Οι πελάτες που έρχονται μέσω του κωδικού σας απολαμβάνουν:</p>
      <ul>
        <li>Έλεγχο σήματος (€9 — όπως όλοι).</li>
        <li>Προτεραιότητα: απάντηση εντός 24 ωρών αντί για 48.</li>
        <li>Προσωπική παρακολούθηση από εμάς με αναφορά στον partner που τους παρέπεμψε.</li>
      </ul>

      <div class="callout">
        <strong>Ξεκινήστε σήμερα:</strong> Στείλτε email στο <a href="mailto:partner@brandguard.gr">partner@brandguard.gr</a> με θέμα «Partner Program» και μέσα στη μέρα λαμβάνετε τον κωδικό σας.
      </div>

      <h2>Όροι & προϋποθέσεις</h2>
      <ul>
        <li>Η προμήθεια πληρώνεται 30 ημέρες μετά το cleared payment (για να καλυφθεί τυχόν refund window).</li>
        <li>Πληρωμή μέσω τραπεζικής κατάθεσης ή IRIS σε μηνιαία βάση (min €30 payout threshold).</li>
        <li>Εκδίδουμε τιμολόγιο/απόδειξη για κάθε payout.</li>
        <li>Ο κωδικός είναι μεταβιβάσιμος εντός εταιρείας (λογιστικό γραφείο με 5 συνεργάτες χρησιμοποιεί έναν κωδικό για όλους).</li>
        <li>Απαγορεύεται το cold outreach μας εκ μέρους του partner — οι πελάτες πρέπει να έρχονται οργανικά από τη συνεργασία σας.</li>
      </ul>
    `,
  },

  about: {
    title: 'Σχετικά με το BrandGuard',
    description: 'Το BrandGuard είναι προϊόν της Agentis Venture Studio.',
    label: 'Η ομάδα',
    h1: 'Σχετικά με εμάς',
    lead: 'Το BrandGuard γεννήθηκε από μια απλή παρατήρηση: οι περισσότερες ελληνικές επιχειρήσεις λειτουργούν χωρίς προστασία του brand τους — και δεν το ξέρουν.',
    body: `
      <h2>Ποιοι είμαστε</h2>
      <p>Το BrandGuard είναι προϊόν της <strong>Agentis Venture Studio</strong>, ενός studio που δημιουργεί πρακτικά εργαλεία για ελληνικές επιχειρήσεις. Άλλα προϊόντα μας: <a href="https://lifesimple.gr" target="_blank" rel="noopener">lifesimple.gr</a> (νομικές υπηρεσίες για ιδιώτες).</p>

      <h2>Γιατί υπάρχουμε</h2>
      <p>Στην Ελλάδα, μία στις τρεις επιχειρήσεις έχει brand name που μπορεί να διεκδικήσει νομικά κάποιος άλλος. Δικηγόροι χρεώνουν €500+ για ένα έλεγχο που στην πράξη κοστίζει 15 λεπτά δουλειάς στις δημόσιες βάσεις δεδομένων. Αυτό δημιουργεί friction που κρατά τους SMBs απροστάτευτους.</p>
      <p>Στόχος μας: να κάνουμε τον έλεγχο και την κατοχύρωση προσβάσιμη για κάθε επιχείρηση — με σαφείς τιμές, σαφή αποτελέσματα, σε 48 ώρες.</p>

      <h2>Πώς είμαστε διαφορετικοί</h2>
      <ul>
        <li><strong>100% Ελλάδα-focused.</strong> Γνωρίζουμε τον ΟΒΙ, όχι τον USPTO.</li>
        <li><strong>Transparent pricing.</strong> Η τιμή που βλέπετε είναι και η τιμή που πληρώνετε.</li>
        <li><strong>48ωρος χρόνος απάντησης.</strong> Όχι «θα μιλήσουμε».</li>
        <li><strong>Τεχνική αυτοματοποίηση.</strong> Χρησιμοποιούμε AI και APIs (EUIPO, OBI, Places) για να κρατάμε το κόστος χαμηλό.</li>
      </ul>

      <h2>Επικοινωνία</h2>
      <p>Για συνεργασίες, ερωτήσεις ή press: <a href="mailto:hello@brandguard.gr">hello@brandguard.gr</a></p>
    `,
  },
};

function staticPageHTML(key) {
  const p = PAGES[key];
  if (!p) return `<!DOCTYPE html><html><body><h1>404</h1></body></html>`;
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title}</title>
  <meta name="description" content="${p.description}">
  ${SHARED_HEAD}
</head>
<body>
${NAV}
<main class="page">
  <div class="page-label">${p.label}</div>
  <h1>${p.h1}</h1>
  <p class="lead">${p.lead}</p>
  ${p.body}
</main>
${FOOTER}
</body>
</html>`;
}

module.exports = { staticPageHTML };
