
import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await groq.chat.completions.create({
      model: process.env.MODEL,
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI Error", detail: err.message });
  }
});

app.use(express.static("./"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server RUNNING on port " + PORT));
