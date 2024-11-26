import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Create Redis client
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    reconnectStrategy: (retries: number) => {
      console.warn(`Redis reconnect attempt ${retries}`);
      return Math.min(retries * 100, 3000); // Retry with exponential backoff (max 3 seconds)
    },
  },
});

// Logging and error handling
redisClient.on("connect", () => {
  console.log("Redis: Connected successfully 🥳.");
});

redisClient.on("ready", () => {
  console.log("Redis: Client is ready to use 👋.");
});

redisClient.on("error", (err) => {
  console.error("Redis: Connection error:", err.message);
});

redisClient.on("end", () => {
  console.warn("Redis: Connection closed 😞.");
});

// Initialize Redis connection
const connectRedis = async () => {
  try {
    console.log("Redis: Attempting to connect...");
    await redisClient.connect();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Redis: Failed to connect:", error.message);
    } else {
      console.error("Redis: Unknown error occurred during connection.");
    }
    process.exit(1); // Exit the process if Redis connection fails
  }
};

// Connect to Redis
connectRedis();

export default redisClient;
