const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from TODO app!");
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
