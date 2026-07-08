const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email alert using Resend API
 * @param {string} subject - The subject of the email
 * @param {string} text - The plain text body
 * @param {string} html - The HTML body
 * @param {string} destinationEmail - The email address to send the alert to
 */
async function sendAlertEmail(subject, text, html, destinationEmail) {
  try {
    const toEmail = destinationEmail || process.env.ALERT_DESTINATION_EMAIL || "engineering-manager@company.com";
    
    if (!process.env.RESEND_API_KEY) {
      console.warn("WARNING: RESEND_API_KEY is not set. Check your Render Environment Variables.");
      console.log(`[Mock Email] To: ${toEmail} | Subject: ${subject}`);
      return;
    }

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: 'CodeBeacon Alerts <onboarding@resend.dev>', // Resend free tier requires this specific sender
      to: [toEmail],
      subject: subject,
      html: html,
      text: text,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return;
    }

    console.log("----------------------------------------");
    console.log(`[Resend Email Sent] ${subject} -> ${toEmail} | ID: ${data.id}`);
    console.log("----------------------------------------");

  } catch (error) {
    console.error("Failed to send alert email via Resend:", error);
  }
}

module.exports = { sendAlertEmail };
