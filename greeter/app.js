const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const message = process.env.MESSAGE || "hello";

app.get("/", (req, res) => {
  console.log(`Responding with message: ${message}`);
  res.send(message);
});

app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(
    `Greeter app listening on port ${port} with message: "${message}"`
  );
});
