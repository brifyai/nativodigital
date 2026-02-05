import { ChatSession } from '../types';

// Compress data using simple run-length encoding for demo
// In production, use a proper compression library like pako or lz-string
export const compressData = (data: string): string => {
  try {
    // Simple compression: remove extra whitespace from JSON
    const parsed = JSON.parse(data);
    return JSON.stringify(parsed);
  } catch {
    return data;
  }
};

export const decompressData = (data: string): string => {
  return data; // For simple compression, no decompression needed
};

// Storage with size limits
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
const MAX_SESSIONS = 50; // Keep only last 50 sessions

export const saveToStorage = (key: string, data: any): boolean => {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = compressData(jsonString);
    
    // Check size
    if (compressed.length > MAX_STORAGE_SIZE) {
      console.warn('Data too large for localStorage');
      
      // If it's sessions, trim old ones
      if (key === 'accesoia_sessions' && Array.isArray(data)) {
        const trimmed = data.slice(0, MAX_SESSIONS);
        return saveToStorage(key, trimmed);
      }
      
      return false;
    }
    
    localStorage.setItem(key, compressed);
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    
    // If quota exceeded, try to clear old data
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        // Clear old sessions
        const sessions = getFromStorage<ChatSession[]>('accesoia_sessions', []);
        const trimmed = sessions.slice(0, 20); // Keep only 20 most recent
        localStorage.setItem('accesoia_sessions', JSON.stringify(trimmed));
        
        // Try again
        return saveToStorage(key, data);
      } catch {
        return false;
      }
    }
    
    return false;
  }
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    const decompressed = decompressData(item);
    return JSON.parse(decompressed) as T;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return defaultValue;
  }
};

export const getStorageSize = (): number => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

export const getStorageSizeFormatted = (): string => {
  const bytes = getStorageSize();
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Cache for common responses
const CACHE_KEY = 'nativo_response_cache';
const CACHE_MAX_SIZE = 20;
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  prompt: string;
  response: string;
  timestamp: number;
}

export const getCachedResponse = (prompt: string): string | null => {
  try {
    const cache = getFromStorage<CacheEntry[]>(CACHE_KEY, []);
    const entry = cache.find(e => 
      e.prompt.toLowerCase() === prompt.toLowerCase() && 
      Date.now() - e.timestamp < CACHE_EXPIRY
    );
    return entry ? entry.response : null;
  } catch {
    return null;
  }
};

export const cacheResponse = (prompt: string, response: string): void => {
  try {
    let cache = getFromStorage<CacheEntry[]>(CACHE_KEY, []);
    
    // Remove expired entries
    cache = cache.filter(e => Date.now() - e.timestamp < CACHE_EXPIRY);
    
    // Add new entry
    cache.unshift({
      prompt,
      response,
      timestamp: Date.now()
    });
    
    // Limit cache size
    if (cache.length > CACHE_MAX_SIZE) {
      cache = cache.slice(0, CACHE_MAX_SIZE);
    }
    
    saveToStorage(CACHE_KEY, cache);
  } catch (error) {
    console.error('Error caching response:', error);
  }
};
