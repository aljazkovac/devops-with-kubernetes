const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const logFile = path.join("/shared", "logs.txt");
const counterFile = path.join("/shared", "pingpong-counter.txt");

// Status endpoint - reads both log file and counter file to display combined status
app.get("/status", (req, res) => {
  try {
    let output = "";

    // Read the latest log entry from logFile
    // Handle case where log file doesn't exist yet
    // Add the log content to output variable (without extra newlines)
    try {
      if (fs.existsSync(logFile)) {
        const log = fs.readFileSync(logFile, "utf-8");
        if (log) {
          output = log;
          console.log(`Current output: ${output}`);
        }
      }
    } catch (err) {
      console.log("Error loading log file: ", err);
    }

    // Read the ping-pong counter from counterFile
    // Handle case where counter file doesn't exist yet
    // Add the counter content to output variable on a new line
    try {
      if (fs.existsSync(counterFile)) {
        const counter = fs.readFileSync(counterFile, "utf-8");
        if (counter) {
          output += "\n" + counter;
          console.log(`Current output: ${output}`);
        }
      }
    } catch (err) {
      console.log("Error loading counter file: ", err);
    }

    res.type("text/plain").send(output);
  } catch (error) {
    res
      .status(500)
      .type("text/plain")
      .send(`Error reading files: ${error.message}`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Log reader server running on port ${port}`);
});
