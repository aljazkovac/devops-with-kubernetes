const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const logFile = path.join("/shared", "logs.txt");
const PINGPONG_SERVICE_URL = "http://pingpong-svc:2346/counter";

// Helper function to fetch counter from pingpong service
const fetchPingpongCounter = async () => {
  try {
    const response = await fetch(PINGPONG_SERVICE_URL);
    if (response.ok) {
      return await response.text();
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  } catch (err) {
    console.log("Error fetching counter from pingpong service:", err.message);
    return "Ping / Pongs: 0";
  }
};

// Root route - redirects to status endpoint for user convenience
app.get("/", (req, res) => {
  res.redirect("/status");
});

// Status endpoint - combines log-writer output with HTTP-fetched counter
app.get("/status", async (req, res) => {
  try {
    let output = "";

    // Read timestamp logs from log-writer via shared volume
    try {
      if (fs.existsSync(logFile)) {
        const log = fs.readFileSync(logFile, "utf-8");
        if (log) {
          output = log;
          console.log(`Log content: ${output.trim()}`);
        }
      }
    } catch (err) {
      console.log("Error loading log file: ", err);
    }

    // Fetch counter via HTTP from pingpong service
    const counter = await fetchPingpongCounter();
    if (counter) {
      output += "\n" + counter;
      console.log(`Combined output: ${output}`);
    }

    res.type("text/plain").send(output);
  } catch (error) {
    res
      .status(500)
      .type("text/plain")
      .send(`Error combining data: ${error.message}`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Log reader server running on port ${port}`);
});
