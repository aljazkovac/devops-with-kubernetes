const crypto = require("crypto");

// Generate a UUID that will stay the same for the lifetime of the application
const appId = crypto.randomUUID();
console.log(`Application started with ID: ${appId}`);

// Output timestamp with UUID every 5 seconds
setInterval(() => {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  console.log(`${timestamp}: ${appId}`);
}, 5000);