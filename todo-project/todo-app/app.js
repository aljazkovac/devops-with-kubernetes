const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

// Todo backend configuration
const TODO_BACKEND_URL =
  process.env.TODO_BACKEND_URL || "http://todo-backend-svc:3001";

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Image storage configuration
const IMAGE_DIR_CONFIG = process.env.IMAGE_DIR || "./images";
const IMAGE_DIR = path.isAbsolute(IMAGE_DIR_CONFIG)
  ? IMAGE_DIR_CONFIG
  : path.join(__dirname, IMAGE_DIR_CONFIG);
const CURRENT_IMAGE_PATH = path.resolve(
  IMAGE_DIR,
  process.env.CURRENT_IMAGE_NAME || "current.jpg"
);
const METADATA_PATH = path.resolve(
  IMAGE_DIR,
  process.env.METADATA_NAME || "metadata.json"
);
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION_MS) || 600000; // 10 minutes in milliseconds
const PICSUM_URL = process.env.PICSUM_URL || "https://picsum.photos/1200";

// Ensure image directory exists
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Serve the cached image
app.get("/image", (req, res) => {
  if (fs.existsSync(CURRENT_IMAGE_PATH)) {
    res.sendFile(CURRENT_IMAGE_PATH);
  } else {
    res.status(404).send("Image not found");
  }
});

async function fetchAndCacheImage() {
  try {
    console.log("Fetching new image from Lorem Picsum...");
    const response = await axios.get(PICSUM_URL, { responseType: "stream" });

    // Save the image
    const writeStream = fs.createWriteStream(CURRENT_IMAGE_PATH);
    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        // Save metadata
        const metadata = {
          fetchedAt: Date.now(),
          servedAfterExpiry: false,
        };
        fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
        console.log("Image cached successfully");
        resolve();
      });
      writeStream.on("error", reject);
    });
  } catch (error) {
    console.error("Error fetching image:", error.message);
    throw error;
  }
}

function shouldFetchNewImage() {
  if (!fs.existsSync(METADATA_PATH) || !fs.existsSync(CURRENT_IMAGE_PATH)) {
    return true; // No cache exists
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));
    const now = Date.now();
    const age = now - metadata.fetchedAt;

    // Case 1: Image is fresh (< 10 min) => serve from cache/persistent volume
    if (age < CACHE_DURATION) {
      return false;
    }
    // Case 2: Image just expired and hasn't been served since expiry => serve from cache/persistent volume
    else if (!metadata.servedAfterExpiry) {
      metadata.servedAfterExpiry = true;
      fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
      return false;
    }
    // Case 3: Image expired and already served once => serve new image from API
    else {
      return true;
    }
  } catch (error) {
    console.error("Error reading metadata:", error.message);
    return true; // Fetch new image if metadata is corrupted
  }
}

// CLIENT-SIDE RENDERING: API endpoint called by JavaScript fetch() in index.html
// This acts as a proxy between browser JavaScript and todo-backend microservice
// Browser → /api/todos → todo-backend-svc:3001 → returns JSON for dynamic rendering
app.get("/api/todos", async (req, res) => {
  try {
    const response = await axios.get(`${TODO_BACKEND_URL}/todos`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching todos:", error.message);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// SERVER-SIDE RENDERING: Handle HTML form submission (traditional web approach)
// Form POST → server processes → redirect back to main page
// Browser → /todos → todo-backend-svc:3001 → redirect to refresh page
app.post("/todos", async (req, res) => {
  try {
    const { todo } = req.body;
    if (!todo || todo.trim().length === 0) {
      return res.redirect("/?error=empty");
    }

    const response = await axios.post(`${TODO_BACKEND_URL}/todos`, {
      text: todo.trim(),
    });

    console.log("Todo created:", response.data.todo);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating todo:", error.message);
    res.redirect("/?error=failed");
  }
});

// HYBRID ARCHITECTURE: Serve static HTML (server-side) + dynamic content loading (client-side)
// 1. Server-side: We serve the HTML structure immediately for fast initial load
// 2. Client-side: JavaScript in HTML then calls /api/todos to dynamically load todo data
// This combines the benefits of traditional server rendering with modern dynamic updates
app.get("/", async (req, res) => {
  try {
    console.log("Main route accessed, checking if new image needed...");
    const shouldFetch = shouldFetchNewImage();
    console.log("Should fetch new image:", shouldFetch);

    if (shouldFetch) {
      console.log("Starting image fetch...");
      await fetchAndCacheImage();
      console.log("Image fetch completed");
    } else {
      console.log("Using cached image");
    }
    // Send static HTML file - todos will be loaded dynamically by client JavaScript
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } catch (error) {
    console.error("Error handling request:", error.message);
    console.error("Full error:", error);
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

app.get("/healthz", async (req, res) => {
  try {
    await axios.get(`${TODO_BACKEND_URL}/healthz`);
    res.status(200).send("OK");
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(500).send("Health check failed");
  }
});

// Serve static files AFTER route handlers to prevent index.html from being served automatically
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
