const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

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
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log("Database tables initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

app.get("/todos", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todos");
    res.json({ todos: result.rows });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /todos - Create a new todo and save it to the database and return it
app.post("/todos", async (req, res) => {
  const { text } = req.body;

  // Validation
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Valid text is required" });
  }

  // Check 140 character limit
  if (text.length > 140) {
    console.error(`Todo rejected: text too long (${text.length} characters, max 140)`);
    return res.status(400).json({ error: "Todo must be 140 characters or less" });
  }

  console.log(`Todo created: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

  try {
    const result = await client.query(
      "INSERT INTO todos (text) VALUES ($1) RETURNING *",
      [text]
    );
    res.status(201).json({ todo: result.rows[0] });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: process.env.SERVICE_NAME || "todo-backend",
  });
});

async function startServer() {
  console.log("Connecting to PostgreSQL...");

  if (await connectToDatabase()) {
    await initializeDatabase();
    console.log("Database initialized successfully");

    app.listen(port, () => {
      console.log(`Todo backend server started on port ${port}`);
    });
  } else {
    console.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }
}

startServer();
