// ============================================================
//  server.js – Contact Form Backend
//  Stack: Node.js + Express + Nodemailer
// ============================================================

// ── 1. Load environment variables from .env ─────────────────
require("dotenv").config();

// ── 2. Import packages ───────────────────────────────────────
const express  = require("express");
const nodemailer = require("nodemailer");
const cors     = require("cors");

// ── 3. Create Express app ────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ── 4. Middleware ────────────────────────────────────────────
app.use(cors());              // Allow requests from any origin (frontend)
app.use(express.json());      // Parse incoming JSON body

// ── 5. Helper – simple email format check ───────────────────
function isValidEmail(email) {
  // Basic regex: something@something.something
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── 6. POST /send-email route ────────────────────────────────
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // ── 6a. Validation ─────────────────────────────────────────
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields (name, email, message) are required.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  // ── 6b. Nodemailer transporter (Gmail SMTP) ────────────────
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,   // Your Gmail address (from .env)
      pass: process.env.GMAIL_PASS,   // App password    (from .env)
    },
  });

  // ── 6c. Build the email ────────────────────────────────────
  const mailOptions = {
    from: `"Contact Form" <${process.env.GMAIL_USER}>`, // Sender shown in inbox
    to:   process.env.GMAIL_USER,                       // Deliver to YOUR inbox
    replyTo: email,                                     // Reply goes to the visitor
    subject: `📬 New message from ${name}`,
    text: `
You received a new contact form submission.

Name   : ${name}
Email  : ${email}

Message:
${message}
    `.trim(),
    html: `
      <h2 style="color:#333;">New Contact Form Submission</h2>
      <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 12px;font-weight:bold;color:#555;">Name</td>
          <td style="padding:6px 12px;">${name}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:6px 12px;font-weight:bold;color:#555;">Email</td>
          <td style="padding:6px 12px;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 12px;font-weight:bold;color:#555;vertical-align:top;">Message</td>
          <td style="padding:6px 12px;white-space:pre-wrap;">${message}</td>
        </tr>
      </table>
    `,
  };

  // ── 6d. Send the email ─────────────────────────────────────
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent – from: ${email}, name: ${name}`);
    return res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to send email. Please try again later.",
    });
  }
});

// ── 7. Health-check route (optional) ────────────────────────
app.get("/", (req, res) => {
  res.send("Contact Form Backend is running ✅");
});

// ── 8. Start server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});