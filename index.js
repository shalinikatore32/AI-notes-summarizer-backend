const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();
const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Route: Summarize Transcript
app.post("/summarize", async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    if (!transcript || !prompt) {
      return res
        .status(400)
        .json({ error: "Transcript and prompt are required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a meeting notes summarizer. 
          Always return output in **Markdown format** with:
          - Clear headings (**bold**)
          - Bullet points (-)
          - Numbered lists (1., 2., 3.)
          - Important terms highlighted with **bold**
          Example:
          ## Key Points
          - **Decision:** Approve budget
          - **Next Steps:**
            1. Send proposal
            2. Schedule follow-up meeting`,
        },
        {
          role: "user",
          content: `Transcript:\n${transcript}\nInstruction:\n${prompt}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error("Error in summarization:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// Route: Send Email
app.post("/send-email", async (req, res) => {
  try {
    const { to, summary } = req.body;

    if (!to || !summary) {
      return res
        .status(400)
        .json({ error: "Recipient email and summary are required" });
    }

    // Debug: check if env vars exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Missing email environment variables");
      return res.status(500).json({ error: "Email configuration missing" });
    }

    // Gmail SMTP (better than service: "gmail")
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password if using 2FA
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: `"AI Notes Summarizer" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Meeting Summary",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${summary}</div>`,
    });

    console.log("✅ Email sent:", info.messageId);
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error in email:", err.message, err.response);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
