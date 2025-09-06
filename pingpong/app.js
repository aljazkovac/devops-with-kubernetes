const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;

let counter = 0;

app.get("/pingpong", (req, res) => {
  counter++;
  res.send(`pong ${counter}`);
  console.log(`Ping-pong count: ${counter}`);
});

app.get("/counter", (req, res) => {
  res.type("text/plain").send(`Ping / Pongs: ${counter}`);
});

app.listen(PORT, () => {
  console.log(`Ping-pong application listening on port ${PORT}`);
});
