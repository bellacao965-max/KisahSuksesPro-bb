
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 200
      })
    });

    const data = await result.json();

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(3000, () => console.log("AI Server ready on port 3000"));
