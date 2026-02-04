/* eslint-disable no-console */
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const url = require("url");
const os = require("os");
const path = require("path");
const ytdl = require("@distube/ytdl-core");

const fs = require("fs");

// Configure ytdl-core to stop saving debug "player-script.js" files in the project root
process.env.YTDL_NO_DEBUG_FILE = "true";

// Load cookies from environment variable OR cookies.json
let cookies = [];
const cookiesPath = path.join(__dirname, "cookies.json");

if (process.env.YOUTUBE_COOKIES) {
  try {
    cookies = JSON.parse(process.env.YOUTUBE_COOKIES);
    console.log(
      "SUCCESS: Cookies loaded from YOUTUBE_COOKIES environment variable.",
    );
    console.log(`Detected ${cookies.length} cookies.`);
  } catch (err) {
    console.error(
      "ERROR: Failed to parse YOUTUBE_COOKIES environment variable. Ensure it's valid JSON.",
    );
    console.error(err.message);
  }
} else if (fs.existsSync(cookiesPath)) {
  try {
    const fileContent = fs.readFileSync(cookiesPath, "utf-8").trim();
    if (fileContent && fileContent !== "[]") {
      cookies = JSON.parse(fileContent);
      console.log("SUCCESS: Cookies loaded from cookies.json file.");
      console.log(`Detected ${cookies.length} cookies.`);
    } else {
      console.log(
        "INFO: cookies.json is empty or contains []. No cookies loaded.",
      );
    }
  } catch (err) {
    console.error(
      "ERROR: Failed to parse cookies.json. Ensure it's valid JSON.",
    );
    console.error(err.message);
  }
} else {
  console.log(
    "WARNING: No cookies found in environment variable or cookies.json. Bot detection is likely.",
  );
}

// Create a ytdl agent for better reliability and avoiding 403 Forbidden errors
// Passing cookies to the agent helps bypass "Sign in to confirm you're not a bot" errors
const agent = ytdl.createAgent(cookies);

const app = express();
const port = process.env.PORT || 4522;

app.use(helmet());
app.use(express.json());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(418).send("oh no error");
});

app.get("/api/img", (req, res, next) => {
  const imgURL = url.parse(req.query.url);
  http
    .request(
      {
        // head because we only care about whether it exists or not
        method: "HEAD",
        hostname: imgURL.hostname,
        path: imgURL.pathname,
        port: imgURL.port,
      },
      (response) => {
        res.json({ status: response.statusCode });
      },
    )
    .on("error", (err) => {
      next(err);
    })
    .end();
});

app.post("/api/get", async (req, res, next) => {
  const { url } = req.body;
  let data;
  let filterURL;
  if (!url) {
    return res.status(400).json({ message: "YouTube URL is required" });
  }

  try {
    console.log("Calling ytdl.getInfo with Agent...");
    data = await ytdl.getInfo(url, { agent });
    console.log("ytdl.getInfo success. Data title:", data.videoDetails.title);
  } catch (err) {
    console.error("Error in ytdl.getInfo:", err.message);
    res.status(500).json({
      message: "Could not fetch video info. Make sure the URL is valid.",
    });
    return;
  }

  // console.log("Data formats:", data.formats);

  const videoMap = new Map();
  data.formats
    .filter((f) => f.hasVideo)
    .forEach((f) => {
      const key = `${f.qualityLabel}-${f.container}`;
      // If we don't have this quality/container yet, or if this one has audio and the existing one doesn't
      if (!videoMap.has(key) || (f.hasAudio && !videoMap.get(key).hasAudio)) {
        videoMap.set(key, {
          quality: f.qualityLabel,
          extension: f.container,
          url: f.url,
          isAudio: false,
          hasAudio: f.hasAudio,
        });
      }
    });

  const formats = Array.from(videoMap.values());

  const audioFormats = data.formats
    .filter((f) => !f.hasVideo && f.hasAudio)
    .slice(0, 3) // Get first few audio formats
    .map((f) => ({
      quality: f.audioBitrate + "kbps",
      extension: f.container,
      url: f.url,
      isAudio: true,
    }));

  res.json({
    title: data.videoDetails.title,
    thumbnail:
      data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1].url,
    author: data.videoDetails.author.name,
    formats: [...formats, ...audioFormats],
  });
});

app.listen(port, "0.0.0.0", () => console.log(`listening on port ${port}`));
