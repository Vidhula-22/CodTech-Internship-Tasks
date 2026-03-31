const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/productivity");

// Schema
const Data = mongoose.model("Data", new mongoose.Schema({
  site: String,
  time: Number,
  date: { type: Date, default: Date.now }
}));

// API to store tracking data
app.post("/track", async (req, res) => {
  try {
    const { site, time } = req.body;
    await Data.create({ site, time });
    console.log("Saved:", site, time);
    res.send("Saved");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// API for analytics
app.get("/analytics", async (req, res) => {
  const data = await Data.find();

  let result = {};

  data.forEach(d => {
    if (!result[d.site]) {
      result[d.site] = 0;
    }
    result[d.site] += d.time;
  });

  res.json(result);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});