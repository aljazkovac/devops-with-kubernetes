const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 9000;

let counter = 0;
const counterFile = path.join("/shared", "pingpong-counter.txt");

// Load counter from file on startup, save counter to file on each request
// Handle cases where file doesn't exist initially

app.get("/pingpong", (req, res) => {
  counter++;
  res.send(`pong ${counter}`);

  let line = `Ping / Pongs: ${counter}`;
  fs.writeFile(counterFile, line, (err) => {
    if (err) {
      console.error("Error writing to counter file:", err);
    } else {
      console.log(`Written counter ${counter} to the file.`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Ping-pong application listening on port ${PORT}`);
  try {
    if (fs.existsSync(counterFile)) {
      const file = fs.readFileSync(counterFile, "utf-8");
      const match = file.match(/Ping \/ Pongs: (\d+)/);
      if (match) {
        counter = parseInt(match[1], 10);
        console.log(`Loaded counter: ${counter}`);
      } else {
        counter = 0; // fallback if format is unexpected
        console.log("Unexpected format, counter reset to 0.");
      }
    }
  } catch (err) {
    console.log("Error loading counter: ", err);
  }
});
