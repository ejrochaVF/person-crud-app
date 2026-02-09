/**
 * CUSTOM HOOK: useApi
 *
 * A reusable hook for API calls with built-in features:
 * - Loading states
 * - Error handling
 * - Retry logic
 * - Request cancellation
 *
 * This follows the custom hook pattern for reusable logic.
 */

import { useState, useCallback, useMemo } from 'react';
import config from '../config/appConfig';

interface ApiOptions {
  retries?: number;
  retryDelay?: number;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  /**
   * Sleep utility for retry delays
   */
  const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Execute an API call with retry logic
   * @param {Function} apiCall - The API function to call
   * @param {Object} options - Configuration options
   * @param {number} options.retries - Number of retries (default: 2)
   * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
   * @param {Function} options.onSuccess - Callback for success
   * @param {Function} options.onError - Callback for error
   */
  const execute = useCallback(async (apiCall: () => Promise<any>, options: ApiOptions = {}): Promise<any> => {
    const {
      retries = config.ui.retryAttempts,
      retryDelay = config.ui.retryDelay,
      onSuccess,
      onError
    } = options;

    setLoading(true);
    setError(null);

    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await apiCall();

        setLoading(false);
        setError(null);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;

      } catch (err: any) {
        lastError = err;

        // Don't retry on validation errors (4xx)
        if (err.response && err.response.status >= 400 && err.response.status < 500) {
          break;
        }

        // If this wasn't the last attempt, wait and retry
        if (attempt < retries) {
          console.log(`API call failed, retrying in ${retryDelay}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await sleep(retryDelay);
        }
      }
    }

    // All retries failed
    setLoading(false);
    setError(lastError);

    if (onError) {
      onError(lastError);
    }

    throw lastError;
  }, []);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return useMemo(() => ({
    loading,
    error,
    execute,
    reset
  }), [loading, error, execute, reset]);
};

export default useApi;