const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db');
const { sendPaymentConfirmation, sendPaymentAdminNotification } = require('../email');

// Stripe product config — prices created on first run or use existing price IDs
const PRODUCTS = {
  check: {
    name: 'BrandGuard Trademark Check',
    amount: 900, // cents
    currency: 'eur',
    display: '€9',
    mode: 'payment', // one-time
  },
  report: {
    name: 'BrandGuard Risk Report',
    amount: 2900, // cents
    currency: 'eur',
    display: '€29',
    mode: 'payment', // one-time
  },
  kit: {
    name: 'BrandGuard Filing Kit',
    amount: 5900,
    currency: 'eur',
    display: '€59',
    mode: 'payment', // one-time
  },
  monitoring: {
    name: 'BrandGuard Monitoring (yearly)',
    amount: 9900,
    currency: 'eur',
    display: '€99/year',
    mode: 'subscription', // recurring annual
    interval: 'year',
  },
};

// Create Stripe checkout session
router.get('/create-checkout', async (req, res) => {
  try {
    const { product, lead_id } = req.query;
    const productConfig = PRODUCTS[product];

    if (!productConfig) {
      return res.status(400).send('Invalid product');
    }

    const baseUrl = process.env.BASE_URL || `https://${req.hostname}`;

    const lineItem = productConfig.mode === 'subscription'
      ? {
          price_data: {
            currency: productConfig.currency,
            product_data: { name: productConfig.name },
            unit_amount: productConfig.amount,
            recurring: { interval: productConfig.interval || 'year' },
          },
          quantity: 1,
        }
      : {
          price_data: {
            currency: productConfig.currency,
            product_data: { name: productConfig.name },
            unit_amount: productConfig.amount,
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: productConfig.mode || 'payment',
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&lead_id=${lead_id || ''}`,
      cancel_url: `${baseUrl}/payment?product=${product}&lead_id=${lead_id || ''}`,
      metadata: {
        product,
        lead_id: lead_id || '',
      },
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error('Error creating Stripe checkout session:', err.message);
    res.status(500).send('Payment error: ' + err.message);
  }
});

// Payment success page
router.get('/payment-success', async (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>BrandGuard — Επιτυχής Πληρωμή</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8f9fa; display:flex; align-items:center; justify-content:center; min-height:100vh; }
    .card { background:#fff; border-radius:12px; padding:48px; max-width:480px; text-align:center; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .icon { font-size:48px; margin-bottom:16px; }
    h2 { color:#1a1a2e; margin-bottom:12px; }
    p { color:#555; line-height:1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🎉</div>
    <h2>Η πληρωμή ολοκληρώθηκε!</h2>
    <p>Ευχαριστούμε για την αγορά σας. Θα λάβετε επιβεβαίωση στο email σας και το αποτέλεσμά σας εντός 2 εργάσιμων ημερών.</p>
    <p style="margin-top:16px;"><a href="/" style="color:#e94560;">← Επιστροφή στην αρχική</a></p>
  </div>
</body>
</html>`);
});

// Stripe webhook — handle payment confirmation
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { product, lead_id } = session.metadata || {};
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    const productConfig = PRODUCTS[product] || { name: 'BrandGuard Product', display: '€?' };

    console.log(`Payment completed: product=${product}, lead_id=${lead_id}, email=${customerEmail}`);

    // Update lead revenue if lead_id provided
    if (lead_id) {
      try {
        await pool.query(
          `UPDATE leads SET revenue = COALESCE(revenue, 0) + $1, paid_product = $2, outreach_status = 'converted' WHERE id = $3`,
          [productConfig.amount / 100, productConfig.name, lead_id]
        );
      } catch (dbErr) {
        console.error('Error updating lead revenue:', dbErr.message);
      }
    }

    // Send confirmation email
    if (customerEmail) {
      try {
        await sendPaymentConfirmation(customerEmail, customerName, productConfig.name, productConfig.display);
      } catch (emailErr) {
        console.error('Error sending payment confirmation:', emailErr.message);
      }

      try {
        await sendPaymentAdminNotification({
          email: customerEmail,
          productName: productConfig.name,
          amount: productConfig.display,
          leadId: lead_id,
        });
      } catch (emailErr) {
        console.error('Error sending payment admin notification:', emailErr.message);
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;
