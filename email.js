const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SENDER = 'hello@agentis.gr';
const ADMIN_EMAIL = 'hello@agentis.gr';

// Inbound lead confirmation (Greek)
async function sendInboundConfirmation(toEmail, contactName, businessName) {
  const msg = {
    to: toEmail,
    from: SENDER,
    subject: 'Λάβαμε το αίτημά σας — BrandGuard',
    text: `Γεια σας ${contactName || ''},\n\nΕυχαριστούμε για το αίτημά σας ελέγχου εμπορικού σήματος για "${businessName}".\n\nΘα επικοινωνήσουμε μαζί σας εντός 2 εργάσιμων ημερών με τα αποτελέσματα.\n\nΜε εκτίμηση,\nΗ ομάδα BrandGuard\nbrandguard.gr`,
    html: `<p>Γεια σας <strong>${contactName || ''}</strong>,</p>
<p>Ευχαριστούμε για το αίτημά σας ελέγχου εμπορικού σήματος για <strong>"${businessName}"</strong>.</p>
<p>Θα επικοινωνήσουμε μαζί σας εντός <strong>2 εργάσιμων ημερών</strong> με τα αποτελέσματα.</p>
<p>Με εκτίμηση,<br><strong>Η ομάδα BrandGuard</strong><br><a href="https://brandguard.gr">brandguard.gr</a></p>`,
  };
  await sgMail.send(msg);
  console.log(`Confirmation email sent to ${toEmail}`);
}

// Admin notification of new inbound lead (English)
async function sendAdminNotification({ business_name, contact_name, contact_email, sector, city, leadId }) {
  const msg = {
    to: ADMIN_EMAIL,
    from: SENDER,
    subject: `New BrandGuard Lead: ${business_name}`,
    text: `New inbound lead received.\n\nLead ID: ${leadId}\nBusiness: ${business_name}\nContact: ${contact_name}\nEmail: ${contact_email}\nSector: ${sector}\nCity: ${city}\n\nView in admin: https://brandguard.gr/admin/leads`,
    html: `<h2>New Inbound Lead</h2>
<table>
  <tr><td><strong>Lead ID:</strong></td><td>${leadId}</td></tr>
  <tr><td><strong>Business:</strong></td><td>${business_name}</td></tr>
  <tr><td><strong>Contact:</strong></td><td>${contact_name}</td></tr>
  <tr><td><strong>Email:</strong></td><td>${contact_email}</td></tr>
  <tr><td><strong>Sector:</strong></td><td>${sector}</td></tr>
  <tr><td><strong>City:</strong></td><td>${city}</td></tr>
</table>
<p><a href="https://brandguard.gr/admin/leads">View in Admin Dashboard</a></p>`,
  };
  await sgMail.send(msg);
  console.log(`Admin notification sent for lead: ${business_name}`);
}

// Payment confirmation (Greek)
async function sendPaymentConfirmation(toEmail, contactName, productName, amount) {
  const msg = {
    to: toEmail,
    from: SENDER,
    subject: `Επιβεβαίωση πληρωμής — ${productName}`,
    text: `Γεια σας ${contactName || ''},\n\nΕυχαριστούμε για την αγορά σας!\n\nΠροϊόν: ${productName}\nΠοσό: ${amount}\n\nΘα λάβετε το αποτέλεσμά σας εντός 2 εργάσιμων ημερών.\n\nΜε εκτίμηση,\nΗ ομάδα BrandGuard`,
    html: `<p>Γεια σας <strong>${contactName || ''}</strong>,</p>
<p>Ευχαριστούμε για την αγορά σας!</p>
<p><strong>Προϊόν:</strong> ${productName}<br><strong>Ποσό:</strong> ${amount}</p>
<p>Θα λάβετε το αποτέλεσμά σας εντός <strong>2 εργάσιμων ημερών</strong>.</p>
<p>Με εκτίμηση,<br><strong>Η ομάδα BrandGuard</strong></p>`,
  };
  await sgMail.send(msg);
  console.log(`Payment confirmation sent to ${toEmail}`);
}

// Admin payment notification (English)
async function sendPaymentAdminNotification({ email, productName, amount, leadId }) {
  const msg = {
    to: ADMIN_EMAIL,
    from: SENDER,
    subject: `BrandGuard Payment: ${productName} — ${amount}`,
    text: `Payment received.\n\nProduct: ${productName}\nAmount: ${amount}\nCustomer: ${email}\nLead ID: ${leadId || 'N/A'}`,
    html: `<h2>Payment Received</h2>
<table>
  <tr><td><strong>Product:</strong></td><td>${productName}</td></tr>
  <tr><td><strong>Amount:</strong></td><td>${amount}</td></tr>
  <tr><td><strong>Customer:</strong></td><td>${email}</td></tr>
  <tr><td><strong>Lead ID:</strong></td><td>${leadId || 'N/A'}</td></tr>
</table>`,
  };
  await sgMail.send(msg);
}

module.exports = {
  sendInboundConfirmation,
  sendAdminNotification,
  sendPaymentConfirmation,
  sendPaymentAdminNotification,
};
