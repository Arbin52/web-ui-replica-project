
import { useEffect, MutableRefObject, useRef, useCallback } from 'react';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  // Last fetch timestamp to prevent excessive updates
  const lastFetchTimestamp = useRef<number>(0);
  // Is fetch in progress flag to prevent overlapping requests
  const fetchInProgress = useRef<boolean>(false);
  
  // Create a stable fetch function
  const throttledFetch = useCallback(async () => {
    // Skip if a fetch is already in progress to prevent overloading
    if (fetchInProgress.current) {
      console.log('Skipping network fetch - previous fetch still in progress');
      return;
    }
    
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimestamp.current;
    
    // Minimum 3 seconds between fetches regardless of requested interval
    if (timeSinceLastFetch < 3000) {
      return;
    }
    
    try {
      fetchInProgress.current = true;
      lastFetchTimestamp.current = now;
      
      // Use AbortController with a strict timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log("Aborting slow network fetch");
        abortController.abort();
      }, 1500); // Very short timeout to prevent UI freezing
      
      await fetchNetworkStatus();
      clearTimeout(timeoutId);
    } catch (err) {
      console.error('Error in network polling:', err);
    } finally {
      fetchInProgress.current = false;
    }
  }, [fetchNetworkStatus]);
  
  useEffect(() => {
    // Clear any existing interval to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set up polling if live updates are enabled
    if (isLiveUpdating) {
      console.log('Setting up network polling with interval:', updateInterval);
      
      // Initial fetch with a delay to let UI render first
      setTimeout(() => {
        if (!fetchInProgress.current) {
          throttledFetch();
        }
      }, 800);
      
      // Use a fixed minimum interval of 5 seconds
      const effectiveInterval = Math.max(5000, updateInterval);
      
      const intervalId = setInterval(() => {
        if (!document.hidden && !fetchInProgress.current) {
          throttledFetch();
        }
      }, effectiveInterval);
      
      intervalRef.current = intervalId;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, throttledFetch, intervalRef]);
};
