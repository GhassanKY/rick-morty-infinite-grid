import { RETRY_CONFIG, TIME } from "../constants/api";
import { ApiResponse } from "../intefaces/apiResponse";

/**
 * Calculates the wait time (in ms) before performing a retry.
 * If the server provides a 'retry-after' header, it respects that value.
 * Otherwise, it applies an exponential backoff ($2^{4 - \text{retries}}$)
 * plus a random 'jitter' to prevent simultaneous request collisions.
 */
export const getRetryDelay = (retries: number, retryAfterHeader?: string): number => {
  const exponent = RETRY_CONFIG.MAX_RETRIES - retries + RETRY_CONFIG.RETRY_STEP;
  
  const delayInSeconds = retryAfterHeader 
    ? parseInt(retryAfterHeader, 10) 
    : Math.pow(2, exponent);
    
  const jitter = Math.random() * RETRY_CONFIG.JITTER_MAX_MS;
  
  return (delayInSeconds * TIME.SECONDS_TO_MS) + jitter;
};

/**
 * Type Guard to verify the structure of an API response.
 * Ensures the 'info' metadata exists and the primary data field is a valid array.
 */
export const isValidResponse = (data: ApiResponse, field: keyof ApiResponse): boolean => {
  return !!data && !!data.info && Array.isArray(data[field]);
};

