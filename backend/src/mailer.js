const nodemailer = require('nodemailer');

/**
 * Sends an email alert using Ethereal Mail (fake SMTP service for testing)
 * @param {string} subject - The subject of the email
 * @param {string} text - The plain text body
 * @param {string} html - The HTML body
 */
async function sendAlertEmail(subject, text, html) {
  try {
    let transporter;

    // Use real SMTP if credentials are provided in .env
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to sendgrid, ses, etc.
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback to Ethereal (fake test emails) for local development
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const destinationEmail = process.env.ALERT_DESTINATION_EMAIL || "engineering-manager@company.com";

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"ReviewPilot Alerts" <alerts@reviewpilot.local>', // sender address
      to: destinationEmail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log("----------------------------------------");
    console.log(`[Email Alert Sent] ${subject} -> ${destinationEmail}`);
    if (!process.env.SMTP_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    console.log("----------------------------------------");

  } catch (error) {
    console.error("Failed to send alert email:", error);
  }
}

module.exports = { sendAlertEmail };
