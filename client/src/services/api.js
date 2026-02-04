import axios from "axios";

// --- CONFIGURATION ---
// Option 1: Vercel (Production)
const BASE_URL = "https://yt-video-downloader-server-xi.vercel.app/api";

// Option 2: Android Emulator (Localhost)
// const BASE_URL = 'http://10.0.2.2:4522/api';

// Option 3: Physical Device (Use your computer's local IP)
// Run 'ipconfig' in your terminal to find your IPv4 Address
// const BASE_URL = "http://192.168.0.100:4522/api";
// ---------------------

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getVideoInfo = async (youtubeUrl) => {
  try {
    const response = await api.post("/get", { url: youtubeUrl });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unknown error occurred";
    console.error("Error fetching video info:", message);
    throw new Error(message);
  }
};

export default api;
