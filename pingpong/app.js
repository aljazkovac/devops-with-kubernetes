const express = require("express");
const { Client } = require("pg");
const app = express();
const PORT = process.env.PORT || 9000;

// PostgreSQL connection configuration
const dbConfig = {
  host: process.env.POSTGRES_HOST || "postgres-svc",
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || "ps_db",
  user: process.env.POSTGRES_USER || "ps_user",
  password: process.env.POSTGRES_PASSWORD || "SecurePassword",
};

let client;

async function connectToDatabase() {
  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      client = new Client(dbConfig);
      await client.connect();
      console.log("Connected to PostgreSQL");
      return true;
    } catch (error) {
      console.error(
        `Error connecting to PostgreSQL (attempt ${i + 1}/${maxRetries}):`,
        error.message
      );

      if (client) {
        try {
          await client.end();
        } catch (endError) {
          // Ignore cleanup errors
        }
        client = null;
      }

      if (i < maxRetries - 1) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  return false;
}

async function initializeDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS counter (
        id INTEGER PRIMARY KEY,
        counter_value INTEGER DEFAULT 0
      );
    `;

    const insertQuery = `
      INSERT INTO counter (id, counter_value)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `;

    await client.query(createTableQuery);
    await client.query(insertQuery);
    console.log("Database tables initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

async function incrementCounter() {
  try {
    const result = await client.query(
      "UPDATE counter SET counter_value = counter_value + 1 WHERE id = 1 RETURNING counter_value"
    );
    return result.rows[0].counter_value;
  } catch (error) {
    console.error("Error incrementing counter:", error);
    throw error;
  }
}

async function getCounter() {
  try {
    const result = await client.query(
      "SELECT counter_value FROM counter WHERE id = 1"
    );
    return result.rows[0]?.counter_value || 0;
  } catch (error) {
    console.error("Error getting counter:", error);
    throw error;
  }
}

app.get("/", async (req, res) => {
  try {
    const counter = await incrementCounter();
    res.send(`pong ${counter}`);
    console.log(`Ping-pong count: ${counter}`);
  } catch (error) {
    res.status(500).send("Database error");
  }
});

app.get("/counter", async (req, res) => {
  try {
    const counter = await getCounter();
    res.type("text/plain").send(`Ping / Pongs: ${counter}`);
  } catch (error) {
    res.status(500).send("Database error");
  }
});

app.get("/healthz", async (req, res) => {
  try {
    await client.query("SELECT 1");
    return res.status(200).send("OK");
  } catch (error) {
    return res.status(500).send("Database connection error");
  }
});

// Initialize database connection and start server
async function startApp() {
  app.listen(PORT, () => {
    console.log(`Ping-pong application listening on port ${PORT}`);
    console.log("Server started correctly");
  });

  while (true) {
    console.log("Attempting to connect to PostgreSQL...");
    // connectToDatabase already attempts 5 retries internally
    if (await connectToDatabase()) {
      await initializeDatabase();
      console.log("Database initialized successfully");
      break; // Exit the loop once connected and initialized
    }
    console.error("Failed to establish database connection. Retrying in 5 seconds...");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

startApp();
