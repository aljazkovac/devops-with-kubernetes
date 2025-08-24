const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const logFile = path.join("/shared", "logs.txt");

// Status endpoint - reads from the shared log file and displays content
app.get('/status', (req, res) => {
  try {
    if (fs.existsSync(logFile)) {
      const fileContent = fs.readFileSync(logFile, 'utf8');
      res.type('text/plain').send(fileContent);
    } else {
      res.type('text/plain').send("Log file not found yet. Waiting for logs...");
    }
  } catch (error) {
    res.status(500).type('text/plain').send(`Error reading log file: ${error.message}`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Log reader server running on port ${port}`);
});