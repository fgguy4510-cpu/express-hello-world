const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());            // Allow CodePen to call your backend
app.use(express.json());    // Parse JSON bodies

// Route to create video
app.post("/api/eden/video/create", async (req, res) => {
  try {
    const { prompt, duration, resolution, provider } = req.body;

    const edenRes = await fetch("https://api.edenai.run/v2/video/generation", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.EDEN_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        providers: [provider],
        text: prompt,
        resolution,
        duration
      })
    });

    const data = await edenRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to check video status
app.get("/api/eden/video/status/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const edenRes = await fetch(`https://api.edenai.run/v2/video/status/${jobId}`, {
      headers: {
        "Authorization": `Bearer ${process.env.EDEN_API_KEY}`
      }
    });

    const data = await edenRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Render requires PORT from env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
