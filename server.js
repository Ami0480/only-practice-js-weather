const express = require("express");
const axios = require("axios");
const app = express();

const windyApiKey = "WdPpMJYXKhCqqJawwSfoS6jLruh3ew37";

app.get("/webcam", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon)
    return res.status(400).json({ error: "Missing lat or lon" });

  try {
    const url = `https://api.windy.com/api/webcams/v2/list/nearby/${lat},${lon},50?show=webcams:image,location&key=${windyApiKey}`;
    const response = await axios.get(url);

    // Transform the data to the desired format
    const webcams = response.data.result.webcams.map((cam) => ({
      image: {
        current: {
          preview: cam.image?.current?.preview || null,
        },
      },
      location: {
        city: cam.location?.city || null,
        region: cam.location?.region || null,
      },
    }));

    res.json({ result: { webcams } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
