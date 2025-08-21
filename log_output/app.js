const crypto = require("crypto");
const http = require("http");

// Generate a UUID that will stay the same for the lifetime of the application
const appId = crypto.randomUUID();
console.log(`Application started with ID: ${appId}`);

// Function to get current status
const getCurrentStatus = () => {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  return { timestamp, appId };
};

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/status' && req.method === 'GET') {
    const status = getCurrentStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Output timestamp with UUID every 5 seconds
setInterval(() => {
  const status = getCurrentStatus();
  console.log(`${status.timestamp}: ${status.appId}`);
}, 5000);

