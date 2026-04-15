# BrandGuard — Autonomy Roadmap

**Last updated:** 2026-04-15
**Purpose:** Assess the feasibility of running BrandGuard as a fully autonomous lead-generation and outreach system — find Greek SMBs → check trademark status → send compliant outreach → accept payment — with zero manual review in the loop. This document maps what's possible today, what's blocked, and a concrete sequence to get to autonomy.

---

## 1. ΓΕΜΗ Data Access (businessportal.gr + publicity.businessportal.gr)

**Findings:**
- ΓΕΜΗ publishes a documented OpenData API via `opendata-api.businessportal.gr` and `opendata.businessportal.gr` (Swagger/OpenAPI 2.0 spec).
- License: **ODC-BY-1.0** — open data use is permitted.
- Response format: **JSON over REST.**
- **Access requires registration:** submit a form at `opendata.businessportal.gr/register/`, then wait for Central ΓΕΜΗ Service to issue an API key. Approval timeline is not published — must contact them directly.
- **No unauthenticated public tier.** Scraping the public site directly is infeasible: behind `EGRESS_BLOCKED` controls and standard anti-bot protections. Likely violates ToS.

**Filters & fields:**
- Search by: ΓΕΜΗ number, ΑΦΜ (tax ID), or business name.
- **KAD (Activity Code) filtering is supported** — ΓΕΜΗ API integrates with the AADE KAD database (`commercial-activity-codes.businessportal.gr`).
- KAD codes relevant to BrandGuard target sectors:
  - **4711** — Retail (food, beverages, tobacco in non-specialised stores)
  - **4721** — Retail specialised food stores
  - **9602** — Beauty/hair salons
  - **1061** — Food production (grain mill products)
  - **5610** — Restaurants and mobile food services
  - **5630** — Cafés / beverage serving
  - **4941–4942** — Road freight / removal (logistics)

**Rate limits:** not publicly disclosed. Test environment has "limited calls per IP"; production limits unspecified — must negotiate after key issuance.

**Verdict:** **Official API is the only viable path.** Automated scraping of the public portal is not technically feasible without breaking ToS and triggering anti-bot defenses.

**Workaround if ΓΕΜΗ delays approval:** use Google Places as primary business source (see §4) and treat ΓΕΜΗ as a verification layer once the API key arrives.

**Sources:** [opendata.businessportal.gr](https://opendata.businessportal.gr/) · [Swagger spec](https://opendata-api.businessportal.gr/opendata/docs/) · [Tech docs](https://opendata.businessportal.gr/techdocs/)

---

## 2. EUIPO Trademark API (dev.euipo.europa.eu)

**Findings:**
- **Free tier: yes.** Self-service registration at `dev.euipo.europa.eu/getting-started`. Sandbox access **instant** upon account creation — no manual review. API key = Client ID + Client Secret (OAuth2 client credentials flow).
- Sandbox and Production are both free.

**Rate limits:**
- Specific RPM thresholds are not published on the landing page. Docs state: "Limits defined by subscription plan + Terms of Use. Exceeding max calls = HTTP 429."
- Free tier is conservative — expect hundreds of requests/minute, not thousands. Actual limit is visible in the developer console per-product after registration.

**Search response fields (Trademark Search API):**
- Application number, owner/applicant info, goods & services, Nice class, status, filing date, registration date, visual similarity data (for image marks), EUIPO case links.
- Format: structured JSON.
- Supports multi-word queries, keyword combinations, Nice-class filtering, date ranges, automatic token caching.

**Critical gap — Greek national marks:**
- EUIPO's API covers **EU-wide (EUIPO) trademarks only, not Greek national-only marks** issued by OBI.
- TMview (EUIPO's front-end) does consolidate OBI data, but TMview disclaimer states data is "exclusively informational character and should be cross-checked with official OBI register."
- OBI → TMview sync frequency is **not documented.** There is a lag of unknown magnitude.
- **Conclusion:** EUIPO API alone will miss most Greek-only registrations. Must query OBI separately.

**Sources:** [dev.euipo.europa.eu](https://dev.euipo.europa.eu/) · [Getting Started](https://dev.euipo.europa.eu/getting-started/) · [FAQ](https://dev.euipo.europa.eu/faq) · [Trademark Search API](https://dev.euipo.europa.eu/product/trademark-search_100/api/trademark-search) · [TMview](https://www.tmdn.org/tmview/)

---

## 3. OBI National Trademark Database (obi.gr)

**Findings:**
- Manual search UI at [`obi.gr/en/trademarks/trade-mark-registration-procedure/trade-marks-availability-check/`](https://www.obi.gr/en/trademarks/trade-mark-registration-procedure/trade-marks-availability-check/).
- E-filing at [`tmfo.obi.gr/sp-ui-tmefiling/`](https://tmfo.obi.gr/sp-ui-tmefiling/) — requires TAXISnet credentials (blocks programmatic filing entirely).
- **No official API exists or is publicly documented.**

**Scrape feasibility:**
- The form is rendered server-side and submits via standard POST. Reverse-engineering the endpoint is possible via DevTools — form params are discoverable.
- Expected anti-bot protections (inferred, not verified): user-agent filtering, IP throttling, likely CAPTCHA on repeated submissions.
- Selenium / Playwright RPA could automate, but detection risk is high (webdriver properties, behavioural analysis).
- **Legal risk: material.** OBI ToS not published openly; scraping a government-adjacent trademark registry probably violates intended use.

**Verdict:** **Not recommended as primary automation path.** Options in priority order:
1. **Best:** contact OBI directly (`info@obi.gr`, `+30 210-6183580`) and request an API or data-sharing agreement — OBI does occasionally grant bulk access to commercial partners.
2. **Fallback:** use TMview (EUIPO consolidated view) as the best available proxy, accepting the sync lag. Mark results "informational — verify with OBI before final legal action."
3. **Last resort:** RPA scraping behind a proxy pool, throttled to <1 req/min, with human review of matches. Accept the ToS risk and monitor for cease-and-desist.

**Sources:** [OBI availability check](https://www.obi.gr/en/trademarks/trade-mark-registration-procedure/trade-marks-availability-check/) · [OBI e-filing](https://www.obi.gr/en/services/trademark-e-filing/)

---

## 4. Business Discovery Source — Google Places vs Alternatives

### Google Places API (current pricing, 2026)

**Tiered by field-mask** (IDs Only, Location, Basic, Advanced, Preferred):
- **Starter:** $100/mo — ~50K calls/mo
- **Essentials:** $275/mo — ~100K calls/mo (includes 10K free monthly credit)
- **Pro:** $1,200/mo — ~250K calls/mo

**Per-request (Essentials tier):**
- Text Search: ~**$0.0275/call**
- Place Details: ~**$0.0055–$0.015/call** depending on field tier

**Greek SMB coverage:** strong in Athens/Thessaloniki/Patras; fair in regional cities. Contact info (website + phone) reliably returned for ~60–80% of listings. Validate per-sector with test queries.

### Foursquare Places API

- Pay-as-you-go, **10,000 free calls/mo on Pro endpoints.** **Drops to 500/mo on June 1 2026** — effectively kills the free tier for this use case.
- Claims 100M+ POIs across 200+ countries; Greek SMB coverage not publicly quantified. Validate before committing.

### OpenStreetMap Overpass API

- **Free, unlimited** on private.coffee / overpass.kumi.systems instances.
- Greek coverage is crowdsourced — quality varies by region.
- **No contact-info field** — must cross-reference with scraped websites for emails. Good for geodata baseline only.

**Conclusion:**
- **Winner: Google Places API** (Essentials tier, $275/mo). Best Greek SMB contact info + coverage. €29 Risk Report × 10 conversions = breakeven on API costs for the month.
- Secondary: OSM Overpass as a free backup for location enumeration when Places quota is hit.
- Foursquare: re-evaluate once its June 2026 pricing lands; ignore for now.

**Implementation note:** the current BrandGuard code already calls Google Places (`lib/placesApi.js`) if `GOOGLE_PLACES_API_KEY` is set, and falls back to Claude-generated leads otherwise.

**Sources:** [Google Maps pricing](https://developers.google.com/maps/billing-and-pricing/pricing) · [Places API usage](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing) · [Foursquare pricing](https://foursquare.com/pricing/) · [Overpass API wiki](https://wiki.openstreetmap.org/wiki/Overpass_API)

---

## 5. Email Outreach Automation (SendGrid + GDPR in Greece)

### SendGrid tiers (2026)

- **No permanent free plan.** As of May 27 2025, only a 60-day trial (max 3,000 emails, 100/day cap).
- **Essentials:** $19.95/mo (50K/mo) → $34.95/mo (100K/mo). 1 teammate, no dedicated IP.
- **Pro:** $89.95/mo+ (100K–2.5M/mo). Dedicated IP, subuser management, email validation, deliverability insights.
- Bulk/Marketing Campaigns share the same monthly quota with transactional email.

### Deliverability reality check

- Cold email to unverified addresses hits the spam folder at **~17.47%** average (2026 benchmark) even with a clean sender.
- SendGrid requires verified Sender Identities (domain + SPF/DKIM/DMARC) — without these, open rate collapses.
- Keep bounce rate <2% to avoid sender-reputation damage. One bad batch of hallucinated emails can burn the domain for weeks.
- Implement `List-Unsubscribe` header (RFC 8058) + unsubscribe link in body → mandatory for Gmail bulk-sender compliance since 2024.

### GDPR — cold B2B email in Greece

- **Governing law:** Greek implementation = **Law 4624/2019.** Authority: **Hellenic Data Protection Authority (HDPA / Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα).**
- **Legal basis for B2B cold email:** Article 6(1)(f) — **Legitimate Interest.** Consent is *not* required if the recipient is a registered business and the message is relevant to their business activity. This is the standard B2B carve-out.
- **Mandatory for every outreach message:**
  - Clear identification of sender (BrandGuard / Agentis Venture Studio).
  - Transparent description of where the data came from (ΓΕΜΗ, Google Places, public website).
  - One-click opt-out mechanism, honoured within **1 calendar day** (stricter than CAN-SPAM's 10-day window).
  - Documented legitimate-interest balancing test (kept internal, produced if HDPA asks).
- **Penalties:** up to **€20M or 4% global revenue** (whichever higher). Greek HDPA has issued fines against companies for unsolicited B2C mail; B2B enforcement is rarer but not zero.
- **Operational implication:** the current BrandGuard code already generates a unique unsubscribe token per recipient (`lib/outreach.js`) and renders a Greek-language opt-out footer in every outreach + follow-up email. The `/unsubscribe` route + `suppression_list` table ensures opt-outs are honoured immediately and permanently.

**Conclusion:** SendGrid is viable at Essentials tier for the first ~12 months. The legal framework supports cold B2B outreach to ΓΕΜΗ-registered businesses **if and only if** every email includes a clear opt-out, the source of the contact is disclosed, and opt-outs are honoured within 24 hours.

**Sources:** [SendGrid pricing](https://sendgrid.com/en-us/pricing) · [Deliverability guide](https://support.sendgrid.com/hc/en-us/articles/17404397687323) · [GDPR cold email (growthlist.co)](https://growthlist.co/gdpr-cold-email/) · [DLA Piper — Greece marketing law](https://www.dlapiperdataprotection.com/?t=electronic-marketing&c=GR) · [Hellenic DPA](https://www.dpa.gr/en)

---

## 6. End-to-End Autonomous Pipeline Assessment

### What "fully autonomous" looks like

A no-touch version of BrandGuard runs this loop every day:

1. **FIND** — query ΓΕΜΗ OpenData (primary) or Google Places (fallback / enrichment) for new SMBs matching target KAD + region.
2. **CHECK** — for each business, query EUIPO API, then OBI/TMview fallback, to detect whether the trading name is a registered mark. Score matches by Nice-class overlap.
3. **MATCH** — cross-reference applicant name/domain → conflict score. Threshold above X = "unprotected, high-value."
4. **OUTREACH** — compose personalised Greek email via Claude → SendGrid dispatch with GDPR footer, List-Unsubscribe header, unique opt-out token.
5. **FOLLOW-UP** — Day 4 gentle nudge, Day 10 final nudge, Day 30 auto-close.
6. **PAY** — recipient clicks Stripe link, pays €29/€79, revenue auto-credited to their lead record. Filing-kit delivery triggered automatically from template engine.

### What's technically blocked right now

| Component | Blocker | Severity |
|---|---|---|
| ΓΕΜΗ API | Requires registration approval; timeline opaque (~2–4 weeks). | High |
| OBI national marks | No official API. Scraping = ToS risk + bot detection. | **Critical** |
| EUIPO ↔ OBI sync gap | Greek national marks not reliably in EUIPO API. | High |
| Contact enrichment cost | Google Places = $275–1,200/mo at production scale. | Medium |
| Email deliverability | Unverified-address bounces burn sender reputation fast. | Medium |
| Legal enforcement automation | Conflict detection is pattern-matching, not law. Every "match" needs legal judgement before coercive language. | **Critical** |

### Recommended build sequence

**Phase 1 — Foundation (Weeks 1–4)**
- Register ΓΕΜΗ OpenData API and apply for OBI data-sharing simultaneously.
- Stand up EUIPO API sandbox (instant, free).
- Validate end-to-end flow manually on 10 real Greek SMBs to confirm match logic.
- **Cost:** €0. **Effort:** ~20 hours.

**Phase 2 — Business discovery (Weeks 5–8)** *(already 70% done — this is where BrandGuard v1 lives today)*
- Google Places integration (done, needs `GOOGLE_PLACES_API_KEY`).
- Email scraper (done, `lib/emailScraper.js`).
- Normalisation + dedup layer in `leads` table (done).
- **Cost:** €275/mo. **Effort:** ~15 hours remaining (validation + bounce checking).

**Phase 3 — Trademark matching (Weeks 9–12)**
- EUIPO API integration + Nice-class similarity scoring.
- OBI fallback via TMview (accept sync lag) or RPA (behind proxy, throttled).
- Conflict threshold tuning against manual test set.
- **Cost:** €0. **Effort:** ~40 hours — this is the core IP of the product.

**Phase 4 — Email automation & GDPR (Weeks 13–16)** *(80% done today)*
- SendGrid auto-send (done, `lib/outreach.js`).
- GDPR unsubscribe route + suppression list (done, `/unsubscribe` route + `suppression_list` table).
- Follow-up sequence (done, `runFollowUpSequence`).
- **Remaining:** pre-send email validation (paid SendGrid tier feature or ZeroBounce integration), HDPA documentation template, SPF/DKIM/DMARC on brandguard.gr.
- **Cost:** €35/mo SendGrid + one-time DNS config. **Effort:** ~15 hours.

**Phase 5 — Payment & autonomous loop (Weeks 17–20)**
- Stripe Connect integration (done for checkout; needs lead-id attribution audit).
- Daily cron: `/admin/run-follow-ups` + new `/admin/run-discovery` endpoints trigger from Railway scheduled job.
- Exception-handling: high-confidence matches go straight to outreach; medium-confidence queued for human review; low-confidence auto-dropped.
- **Cost:** Stripe 2.9% + €0.30/tx. **Effort:** ~30 hours.

### Realistic timeline — manual MVP to autonomous

| Milestone | Timeline | Human touch required |
|---|---|---|
| Manual MVP | **Today (deployed)** | Full manual — Andreas reviews every batch |
| Semi-automated (find + check) | Weeks 5–12 | Human reviews conflict matches before outreach |
| Auto outreach | Weeks 13–16 | Human spot-checks templates + monitors compliance |
| Full autonomous loop | Weeks 17–24 | Exception handling only (high-risk matches, payment disputes) |

**Estimated runway: ~6 months to ~80% autonomy. Full 100% hands-off is ~9 months and probably not advisable** — trademark enforcement + payment disputes need human judgement in the loop.

### Critical unresolved dependencies

1. **OBI API:** email `info@obi.gr` or call `+30 210-6183580` this week. Without an official channel, coverage of Greek-only marks is permanently incomplete.
2. **ΓΕΜΗ approval timeline:** submit registration immediately; may take 2–4 weeks.
3. **Payment legal review:** each trademark conflict may require legal opinion before we send coercive language. Retain a Greek IP lawyer for template sign-off (one-time ~€500–1,000).
4. **Greek-specific GDPR guidance:** confirm legitimate-interest balancing test language with HDPA or local counsel. Document per the Article 30 ROPA (Record of Processing Activities).

### Bottom line

- **70% autonomous in 12 weeks** (ΓΕΜΗ + EUIPO + Google Places + SendGrid integration, all currently unblocked).
- **85% autonomous in 20 weeks** (add OBI fallback + full GDPR audit trail).
- **95% autonomous in 6+ months** (add payment automation + legal escalation workflow).
- **100% autonomous is not recommended.** Trademark enforcement involves legal judgement; fully-automated coercive outreach is a reputational and legal liability, not a feature.

### What BrandGuard looks like *right now* (v1 as deployed)

- ✅ Public landing page collecting inbound leads.
- ✅ Admin dashboard with Google Places-backed research (falls back to Claude if no Places key).
- ✅ Email scraper pulls real contact emails from target websites.
- ✅ Auto-send via SendGrid with GDPR-compliant footer + unsubscribe route.
- ✅ Follow-up sequence (Day 4 / Day 10 / auto-close Day 30).
- ✅ Stripe checkout + webhook + revenue attribution to lead.
- ⚠ EUIPO trademark check: **manual TMview link only** — next Phase 3 build.
- ⚠ OBI check: **not implemented** — awaiting access channel.
- ⚠ Nice-class conflict scoring: **not implemented** — core of Phase 3.
- ⚠ Daily autonomous cron: **endpoints exist, scheduler not wired** — trivial to add once Railway cron is configured.

This puts BrandGuard at roughly **50% autonomous today**, with a clear path to 80% in under three months given €275/mo Places + €35/mo SendGrid + ~100 engineering hours.
