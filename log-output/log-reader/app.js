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
  res.status(200).send("Log reader service is healthy - GitOps Version");
});

app.get("/healthz", async (req, res) => {
  try {
    await fetch(PINGPONG_SERVICE_URL);
    return res.status(200).send("OK");
  } catch (error) {
    return res.status(500).send("Pingpong service unreachable");
  }
});

// Status endpoint - combines log-writer output with HTTP-fetched counter
app.get("/status", async (req, res) => {
  try {
    let output = "";

    // Read information from config file
    if (fs.existsSync("/config/information.txt")) {
      const info = fs.readFileSync("/config/information.txt", "utf-8");
      if (info) {
        output = info;
        console.log(`ConfigMap file output: ${info.trim()}`);
      }
    }

    // Read message from environment variable
    const message_env = process.env.MESSAGE_ENV_VARIABLE || "No message set";
    output += "\n" + `Environment variable message: ${message_env}`;

    // Read timestamp logs from log-writer via shared volume
    try {
      if (fs.existsSync(logFile)) {
        const log = fs.readFileSync(logFile, "utf-8");
        if (log) {
          output += "\n" + log;
          console.log(`Log content: ${log.trim()}`);
        }
      }
    } catch (err) {
      console.log("Error loading log file: ", err);
    }

    // Fetch counter via HTTP from pingpong service
    const counter = await fetchPingpongCounter();
    if (counter) {
      output += "\n" + counter;
      console.log(`Counter output: ${counter.trim()}`);
    }
    console.log("Combined output:\n", output.trim());
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
