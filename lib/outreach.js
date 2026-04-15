// Auto-outreach sender — sends the generated email via SendGrid with GDPR footer,
// one-click unsubscribe, tracking, and follow-up sequence logic.

const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const pool = require('../db');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SENDER = process.env.OUTREACH_FROM || 'hello@agentis.gr';
const SENDER_NAME = 'BrandGuard';
const BASE_URL = process.env.BASE_URL || 'https://brandguard.gr';

// Generate a deterministic unsubscribe token per email
function makeUnsubscribeToken(email) {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'brandguard-salt-2026';
  return crypto.createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 16);
}

function verifyUnsubscribeToken(email, token) {
  return makeUnsubscribeToken(email) === token;
}

// GDPR-compliant Greek footer that every outreach email MUST include
function buildGdprFooter(toEmail) {
  const token = makeUnsubscribeToken(toEmail);
  const unsubUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(toEmail)}&token=${token}`;
  return {
    text: `\n\n—\nΛάβατε αυτό το email ως εγγεγραμμένη επιχείρηση στη ΓΕΜΗ/Google. Αν δεν θέλετε να λαμβάνετε άλλα email από το BrandGuard, κάντε κλικ εδώ για διαγραφή: ${unsubUrl}\nBrandGuard | Agentis Venture Studio | brandguard.gr`,
    html: `<hr style="margin-top:24px;border:none;border-top:1px solid #eee"><p style="font-size:11px;color:#888;line-height:1.5">Λάβατε αυτό το email ως εγγεγραμμένη επιχείρηση στη ΓΕΜΗ/Google. Αν δεν θέλετε να λαμβάνετε άλλα email από το BrandGuard, <a href="${unsubUrl}" style="color:#888">κάντε κλικ εδώ για διαγραφή</a>.<br>BrandGuard | Agentis Venture Studio | <a href="https://brandguard.gr" style="color:#888">brandguard.gr</a></p>`,
  };
}

// Check if email is on the suppression list (has unsubscribed or bounced)
async function isSuppressed(email) {
  const result = await pool.query(
    `SELECT 1 FROM suppression_list WHERE email = $1 LIMIT 1`,
    [email.toLowerCase()]
  );
  return result.rows.length > 0;
}

// Send a single outreach email (initial or follow-up)
async function sendOutreach({ toEmail, toName, subject, body, leadId, isFollowUp = false }) {
  if (!toEmail) throw new Error('No recipient email');

  // GDPR suppression check
  if (await isSuppressed(toEmail)) {
    console.log(`[outreach] skipped suppressed email: ${toEmail}`);
    return { sent: false, reason: 'suppressed' };
  }

  const footer = buildGdprFooter(toEmail);
  const htmlBody = body.split('\n').map(l => `<p>${escapeHtml(l)}</p>`).join('\n');

  const msg = {
    to: toEmail,
    from: { email: SENDER, name: SENDER_NAME },
    subject,
    text: body + footer.text,
    html: htmlBody + footer.html,
    trackingSettings: {
      clickTracking: { enable: true, enableText: false },
      openTracking: { enable: true },
    },
    customArgs: {
      lead_id: String(leadId || ''),
      outreach_type: isFollowUp ? 'follow_up' : 'initial',
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`[outreach] sent to ${toEmail} (lead ${leadId}, ${isFollowUp ? 'follow-up' : 'initial'})`);

    // Log to outreach_emails table
    await pool.query(
      `INSERT INTO outreach_emails (lead_id, subject, body, sent_at) VALUES ($1, $2, $3, NOW())`,
      [leadId, subject, body]
    );

    // Update lead
    if (!isFollowUp) {
      await pool.query(
        `UPDATE leads SET outreach_status = 'sent', outreach_sent_at = NOW() WHERE id = $1`,
        [leadId]
      );
    } else {
      await pool.query(
        `UPDATE leads SET follow_up_count = COALESCE(follow_up_count, 0) + 1, last_follow_up_at = NOW() WHERE id = $1`,
        [leadId]
      );
    }

    return { sent: true };
  } catch (err) {
    console.error(`[outreach] SendGrid error for ${toEmail}:`, err.message);
    return { sent: false, reason: err.message };
  }
}

// Check for leads that need a follow-up and send them.
// Rules:
//   - Day 4 after initial: send follow-up 1 (if no reply)
//   - Day 10 after initial: send follow-up 2 (if still no reply)
//   - Day 30 after initial: auto-close as 'dead'
async function runFollowUpSequence(generateFollowUpFn) {
  const result = await pool.query(`
    SELECT * FROM leads
    WHERE outreach_status = 'sent'
      AND contact_email IS NOT NULL
      AND outreach_sent_at IS NOT NULL
      AND (
        (COALESCE(follow_up_count, 0) = 0 AND outreach_sent_at < NOW() - INTERVAL '4 days') OR
        (COALESCE(follow_up_count, 0) = 1 AND outreach_sent_at < NOW() - INTERVAL '10 days')
      )
    LIMIT 50
  `);

  let sent = 0;
  for (const lead of result.rows) {
    try {
      const { subject, body } = await generateFollowUpFn(lead);
      const res = await sendOutreach({
        toEmail: lead.contact_email,
        toName: lead.contact_name,
        subject,
        body,
        leadId: lead.id,
        isFollowUp: true,
      });
      if (res.sent) sent++;
    } catch (err) {
      console.error(`Follow-up failed for lead ${lead.id}:`, err.message);
    }
  }

  // Auto-close leads older than 30 days with no reply
  const closed = await pool.query(`
    UPDATE leads SET outreach_status = 'dead'
    WHERE outreach_status = 'sent'
      AND outreach_sent_at < NOW() - INTERVAL '30 days'
    RETURNING id
  `);

  return { sent, closed: closed.rowCount };
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = {
  sendOutreach,
  runFollowUpSequence,
  makeUnsubscribeToken,
  verifyUnsubscribeToken,
};
