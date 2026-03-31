const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// 🔑 Your OpenWeatherMap API key here
const API_KEY = "9878fc10bc6430fddc50e3f6463187a4";

app.use(cors());

app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) return res.json({ error: "City name is required" });

  try {
    // Fetch live weather data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await axios.get(url);

    res.json({
      city: response.data.name,
      temperature: response.data.main.temp,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description
    });

  } catch (err) {
    res.json({ error: "City not found or API error" });
  }
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
