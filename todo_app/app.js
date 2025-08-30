const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

// Image storage configuration
const IMAGE_DIR = "/app/images";
const CURRENT_IMAGE_PATH = path.join(IMAGE_DIR, "current.jpg");
const METADATA_PATH = path.join(IMAGE_DIR, "metadata.json");
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const PICSUM_URL = "https://picsum.photos/1200";

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
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } catch (error) {
    console.error("Error handling request:", error.message);
    console.error("Full error:", error);
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

// Serve static files AFTER route handlers to prevent index.html from being served automatically
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
