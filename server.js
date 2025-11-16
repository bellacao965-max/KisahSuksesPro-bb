
import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// === CONFIG WAJIB UNTUK RENDER ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === CEK ENV VARIABLE WAJIB ===
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY belum di-set!");
}

const MODEL = process.env.MODEL || "llama3-8b-8192";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ==== ROUTE AI ====
app.post("/api/ai", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({
        error: "No prompt provided"
      });
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    res.json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({
      error: "AI Error",
      detail: err.message
    });
  }
});


// ==== SERVE STATIC FRONTEND ====
const __dirname = path.resolve();
app.use(express.static(__dirname));

// Untuk SPA / HTML biasa
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ==== START SERVER ====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server RUNNING on port " + PORT);
});
