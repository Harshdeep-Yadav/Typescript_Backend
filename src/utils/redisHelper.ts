// src/helpers/redisHelpers.ts
import redisClient from '../config/redis';

// Interface for Redis-specific errors
export interface RedisError extends Error {
  name: string;
  message: string;
}

/**
 * Get data from Redis cache
 * @param key - The key to retrieve the cached data
 * @returns - The parsed data from Redis or null if not found
 */
export const getFromCache = async (key: string): Promise<any | null> => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data); // If data is found in cache, return parsed data
    }
    return null; // If no data is found in cache, return null
  } catch (error) {
    const redisError: RedisError = new Error(`Unable to get key ${key} from cache`);
    redisError.name = 'RedisError';
    console.error(`Error fetching data from Redis for key ${key}:`, error);
    throw redisError; // Throwing a custom RedisError type
  }
};

/**
 * Set data in Redis cache with optional TTL
 * @param key - The key to set the cached data
 * @param value - The data to cache (stringified automatically)
 * @param ttl - Time-to-live in seconds (default: 3600 seconds, 1 hour)
 */
export const setInCache = async (
  key: string,
  value: any,
  ttl: number = 3600
): Promise<void> => {
  try {
    const stringifiedValue = JSON.stringify(value);
    await redisClient.setEx(key, ttl, stringifiedValue);
    console.log(`Cache set for key ${key} with TTL of ${ttl} seconds.`);
  } catch (error) {
    const redisError: RedisError = new Error(`Unable to set key ${key} in cache`);
    redisError.name = 'RedisError';
    console.error(`Error setting data in Redis for key ${key}:`, error);
    throw redisError; // Throwing a custom RedisError type
  }
};

/**
 * Delete data from Redis cache
 * @param key - The key to delete
 */
export const deleteFromCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
    console.log(`Cache deleted for key ${key}`);
  } catch (error) {
    const redisError: RedisError = new Error(`Unable to delete key ${key} from cache`);
    redisError.name = 'RedisError';
    console.error(`Error deleting data from Redis for key ${key}:`, error);
    throw redisError; // Throwing a custom RedisError type
  }
};

/**
 * A helper function to fetch data from cache, or from fallback if not found in cache
 * @param key - The key to check in cache
 * @param fallbackFn - The function to call if data is not found in cache (e.g., database query)
 * @param ttl - Time-to-live for the cache
 * @returns - The data from cache or fetched via fallback function
 */
export const getOrSetCache = async (
  key: string,
  fallbackFn: () => Promise<any>,
  ttl: number = 10 // Default TTL of 10 seconds
): Promise<any> => {
  try {
    const cachedData = await getFromCache(key); // Check Redis cache
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`); // Log cache hit
      return cachedData; // Return the cached data
    }

    // If cache miss, fetch data using fallback function (e.g., database query)
    const data = await fallbackFn();
    console.log(`Cache miss for key: ${key}`); // Log cache miss

    // Set the fetched data in cache for future use
    await setInCache(key, data, ttl);
    console.log(`Cache set for key ${key} with TTL of ${ttl} seconds.`);

    return data; // Return the fetched data
  } catch (error) {
    const redisError: RedisError = new Error(`Unable to fetch data for key ${key}`);
    redisError.name = 'RedisError';
    console.error(`Error in getOrSetCache for key ${key}:`, error);
    throw redisError; // Throwing a custom RedisError type
  }
};
