const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Generate a UUID that will stay the same for the lifetime of the application
const appId = crypto.randomUUID();
console.log(`Application started with ID: ${appId}`);

// Ensure shared directory exists
const logsDir = "/shared";
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, "logs.txt");

// Function to get current status
const getCurrentStatus = () => {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  return { timestamp, appId };
};

// Status endpoint
app.get('/status', (req, res) => {
  const status = getCurrentStatus();
  res.json(status);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Write timestamp with UUID to file every 5 seconds
setInterval(() => {
  const status = getCurrentStatus();
  const logEntry = `${status.timestamp}: ${status.appId}\n`;
  
  fs.writeFile(logFile, logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    } else {
      console.log(`${status.timestamp}: ${status.appId}`);
    }
  });
}, 5000);

