# BrandGuard — Marketing & Growth Plan

**Product:** BrandGuard — a Greek trademark protection tool for SMBs.
**Revenue model:** €9 Trademark Check (one-time) · €29 Risk Report (one-time) · €59 Filing Kit (one-time) · **€99/year Monitoring (subscription)**.
**Core insight:** 70%+ of Greek SMBs operate an unprotected brand name. They don't know. The first-to-file OBI rule means any competitor or squatter can register it tomorrow. This is a real, under-served pain.

---

## 1. Ideal Customer Profile (ICP)

**Primary ICP — "Defending Growth":**
- Greek SMB, 3–10 years old, €100K–€2M revenue.
- Distinctive (non-descriptive) brand name — i.e. the name has trademark value.
- Operates in a **visible, name-dependent** sector: restaurants/cafés, beauty salons, food production, retail, e-commerce.
- Currently expanding: second location, franchise, new product line, or about to start exports.
- **Lives the pain the day they try to trademark and discover someone else did it first.**
- Buys: Risk Report → Filing Kit within 2 weeks → Monitoring at year end.

**Secondary ICP — "Compliance-Aware Founders":**
- Brand-new businesses, 0–12 months, that want to do things right from day one.
- Often advised by an accountant or tax consultant.
- Lower conversion to paid but best repeat LTV (sticky subscription).

**Tertiary ICP — "Exporters":**
- Food producers, cosmetics, niche retail planning to sell outside Greece.
- Pain point: need EU-wide EUIPO protection, not just national OBI.
- Highest-value segment — upsell opportunity for €250+ expanded packages.

**Who NOT to target:**
- Freelancers without a distinct brand name.
- Very small shops with generic names ("Super Market Ανατολής").
- Companies already served by a named IP law firm.

---

## 2. Target KAD Codes (for ΓΕΜΗ / Places filtering)

Rank by willingness-to-pay × pain density:

| Priority | KAD | Sector | Why |
|---|---|---|---|
| **#1** | 5610, 5630 | Restaurants / cafés | Brand-heavy, expansion-ambitious, lowest CAC via Instagram |
| **#2** | 9602 | Beauty salons | Growing private-label trend, own-brand products common |
| **#3** | 4711, 4721 | Retail / specialised food | Chain expansion drives trademark need |
| **#4** | 1061, 1071, 1089 | Food production | Export path = EUIPO need = high AOV |
| **#5** | 4941, 4942 | Logistics | B2B but high LTV, overlooked by IP providers |
| **#6** | 7310, 9609 | Advertising / services | Agencies that build brands for others — ironic targets |

**Geographic priority:** Athens (Αττική) > Thessaloniki > Patras > Heraklion > Rhodes/Corfu (tourism premium).

---

## 3. Unit Economics

| Metric | Value | Notes |
|---|---|---|
| **Gross ACV mix assumption** | 60% Filing Kit × €59 + 25% Risk Report × €29 + 15% Monitoring × €99/yr | Year 1 mix |
| **Blended ARPA (Year 1)** | ≈ €69 | Weighted avg |
| **Cost to serve** | €4–6/lead | Claude API + Places + SendGrid |
| **Gross margin** | ~90% | Digital product |
| **Target CAC** | €15–20 (inbound) / €3–5 (outbound) | |
| **LTV (2-yr)** | ~€180 | Assuming 60% Monitoring renewal |
| **Target LTV:CAC** | 6–10× inbound · 30×+ outbound | |

**The Monitoring subscription is the real engine** — €99/yr × 60% renewal = stable recurring revenue. A customer who pays for Filing Kit + renews Monitoring twice = €277 LTV on ~€5 CAC.

---

## 4. Channels — ranked by expected ROI

### Channel 1: Outbound cold email (#1 priority — most scalable)
- **Audience:** ~800 target restaurants + 500 beauty salons + 400 retail in Athens alone from Google Places.
- **Cost:** €275/mo Places + €35/mo SendGrid ≈ €310/mo for ~1,700 sends/mo.
- **Expected conversion:** 1–2% reply rate → 15–30 leads/mo → 20% convert to paid → 3–6 sales × €69 blended = €200–400/mo *from outbound alone in month 1*.
- **Improvement over time:** reply-rate climbs as templates improve + sender reputation warms up. Target 3% reply rate by month 3.
- **Status:** Built and deployed (`/admin/send-batch` + `/admin/run-follow-ups`).

### Channel 2: SEO — content on /blog and static pages
- **Target keywords (Greek):** «κατοχύρωση εμπορικού σήματος», «ΟΒΙ έλεγχος σήματος», «first to file Ελλάδα», «κόστος κατοχύρωσης σήματος», «πώς κατοχυρώνω εταιρικό όνομα».
- **Low-hanging content:** 10 articles of 1,500–2,500 words each, published monthly.
- **Expected payoff:** month 4–6 onwards; SEO is a flywheel, not a sprint.
- **Status:** SEO-friendly static pages live (/pricing, /how-it-works, /faq, /about). Blog not yet built — recommend adding `/blog` route with markdown file per post.

### Channel 3: Referral from accountants / λογιστές
- **Why it works:** every Greek SMB has a λογιστής. Accountants regularly field questions like "should I register my name?" and have no answer. Pay them €15 per converted Filing Kit.
- **Action:** curate a list of 50 mid-size accounting firms in Athens, send a B2B partnership email.
- **Tooling:** create `/partner` landing page with referral-code signup.

### Channel 4: Instagram / TikTok awareness
- **Hook:** stitch-able 30-sec explainer videos: "Η καφετέρια σου δεν είναι δική σου. Να γιατί." Shows real examples (anonymised) of Greek businesses that lost their brand.
- **Low organic cost, high viral potential** if one video hits.
- **Status:** not started. Requires Andreas or contractor to film. Zero code required.

### Channel 5: Co-marketing with Agentis network
- Leverage `lifesimple.gr` email list + website traffic for cross-promo.
- Offer Filing Kit as an add-on at checkout for any Lifesimple customer opening a new business.

### Channel 6 (later): Paid Google Ads
- Only after SEO content is indexed. Target: «κατοχύρωση σήματος τιμή», «OBI εμπορικό σήμα».
- Budget ceiling: €300/mo. Expected CPA: €25–40 (high-intent queries).

---

## 5. Messaging Framework

### Core message
**"Η επιχείρησή σας δεν σας ανήκει νομικά μέχρι να καταχωρηθεί."**
- Surprising → attention.
- True → credibility.
- Resolvable → action.

### Sector-specific angles
- **Restaurants/cafés:** "Ανοίγετε δεύτερο κατάστημα; Το όνομα μπορεί να σας κοστίσει €5.000 rebrand."
- **Beauty:** "Η δική σας σειρά προϊόντων δεν μπορεί να πουλήσει online χωρίς κατοχυρωμένο brand."
- **Food production:** "Δεν μπορείτε να μπείτε στις ΑΒ/Σκλαβενίτης χωρίς κατοχυρωμένο σήμα."
- **Logistics:** "Τα B2B contracts απαιτούν απόδειξη brand ownership — όχι ΓΕΜΗ."
- **E-commerce:** "Amazon, Skroutz, Facebook ads — όλα σας ζητούν trademark για παράπονα."

### Avoid
- "Legal compliance" framing → feels bureaucratic.
- Scare tactics (€10.000 fine, lawsuits) → Greek SMBs distrust this tone.
- Generic "protect your brand" → too vague.

---

## 6. The First 90 Days (execution plan)

### Days 1–14: Foundation
- [ ] Populate real API keys in Railway (ANTHROPIC, STRIPE, SENDGRID, GOOGLE_PLACES).
- [ ] Configure DNS: `brandguard.gr` → Railway custom domain.
- [ ] Set up SPF/DKIM/DMARC on `brandguard.gr` for SendGrid.
- [ ] Submit ΓΕΜΗ OpenData API registration (parallel to everything).
- [ ] Email OBI asking for data access channel.
- [ ] Create first 50-lead batch for restaurants in Αττική. Manually review output before send.
- [ ] Send first 20 outreach emails manually (from admin UI). Measure reply rate.

### Days 15–30: First revenue
- [ ] Iterate on email templates based on first 20 replies. Update `SECTOR_HOOKS` in admin.js.
- [ ] Scale to 100 emails/day via `/admin/send-batch`.
- [ ] Aim: 2 paying customers by day 30. Ruthlessly kill sectors with 0% reply.
- [ ] Start first SEO article ("Πόσο κοστίζει η κατοχύρωση εμπορικού σήματος στην Ελλάδα — 2026 αναλυτικός οδηγός").

### Days 31–60: Optimisation
- [ ] 5+ SEO articles live.
- [ ] A/B test 2 subject-line templates. Track open rate per subject.
- [ ] Email 50 accounting firms for referral partnership.
- [ ] Record first Instagram explainer video.
- [ ] Automate follow-up cron (Railway scheduled job hitting `/admin/run-follow-ups`).
- [ ] Target: 15 paying customers (cumulative).

### Days 61–90: Growth
- [ ] Launch Google Ads (if SEO is indexing).
- [ ] Build referral partner portal.
- [ ] Scale outbound to 300/day across 3 sectors.
- [ ] Onboard first 3 Monitoring subscribers from Filing Kit customers.
- [ ] **Target: €2,500 MRR-equivalent by day 90** (mix of one-time + first subscription revenue).

---

## 7. Operational moat (defensible advantages)

1. **Greek-specific data pipeline.** EUIPO + OBI + ΓΕΜΗ integrations that no US/EU competitor bothers to build.
2. **Sector-tuned outreach templates.** Every cold email is personalised via the hook system in `lib/outreach.js`. Competitors send generic "protect your brand" emails.
3. **Price transparency.** €9 / €29 / €59 / €99. Full stop. Competitors (IP law firms) start at €500.
4. **48h SLA.** Nobody else in the Greek market commits to a time-bound response.
5. **Subscription product.** Monitoring locks in customers annually — most competitors are one-shot lawyers.

---

## 8. Risks & mitigation

| Risk | Mitigation |
|---|---|
| ΓΕΜΗ API approval denied or delayed | Google Places fallback is already built and working |
| OBI scraping gets blocked | Partner with a licensed Greek IP law firm who already has OBI access; white-label their data |
| Cold email reputation damage | Aggressive GDPR compliance + list validation + gradual ramp |
| HDPA investigates outreach | Every email has footer, unsubscribe, sender identity; we're defensible under legitimate interest |
| Established IP law firm copies the offer | Unlikely — our €29–99 price point is beneath their minimum viable engagement |
| Google Places costs exceed plan | OpenStreetMap Overpass is a free secondary source (already researched in AUTONOMY_ROADMAP.md) |

---

## 9. Product roadmap (marketing-driven)

### Near term (Q2 2026)
- Blog engine (`/blog` with markdown-backed posts).
- Referral partner portal (`/partner`).
- Stripe subscription billing confirmed working end-to-end.
- Email template A/B test framework in admin dashboard.

### Medium term (Q3 2026)
- **BrandGuard Pro** — €249 package: expanded 3-class filing + expedited 24h response.
- **BrandGuard EU** — €349 EUIPO filing kit for exporters.
- **BrandGuard Check API** — B2B subscription at €99/mo for accountants and agencies.

### Long term (Q4 2026+)
- Integrate with e-shop platforms (Skroutz, eShopBuilder) — embedded trademark check widget.
- Automated OBI filing if/when OBI grants API access.
- Expand to Cyprus (same legal framework, same language).

---

## 10. North Star Metric

**Number of active Monitoring subscribers.**

Why: every Monitoring subscriber = €99/yr ARR, ~60% retention, customer who trusted you enough to pay repeatedly. It's the cleanest proxy for product-market fit and the only metric that compounds monthly.

**Supporting metrics to track weekly:**
- Inbound form submissions (top of funnel).
- Outreach reply rate (outbound quality).
- Free check → paid conversion rate (pricing clarity).
- Filing Kit → Monitoring upsell rate (LTV engine).

---

## Appendix: Quick-start copy for day-1 outreach

**Subject line patterns** (A/B test these):
- A: `Το όνομα «{business_name}» — ερώτηση για το brand σας`
- B: `{business_name} στο {city} — μικρή επαλήθευση`
- C: `Ενημέρωση για «{business_name}» — πριν ανοίξετε νέο`

**Opening line patterns**:
- "Είδα ότι το {business_name} λειτουργεί στο {city} εδώ και χρόνια — και μια γρήγορη σκέψη που ίσως σας ενδιαφέρει:"
- "Προσέχω πολλά {sector} που χτίζουν brand recognition χωρίς να έχουν κατοχυρωμένο το όνομά τους στον ΟΒΙ. Σας αφορά;"

**Callbacks/follow-ups**:
- Day 4: "Δεν ξέρω αν είδατε το προηγούμενο mail — χωρίς πίεση, απλά ήθελα να βεβαιωθώ."
- Day 10: "Τελευταία φορά που σας ενοχλώ, υπόσχομαι. Αν το θέμα δεν σας ενδιαφέρει, θα κρατήσω αποστάσεις."
