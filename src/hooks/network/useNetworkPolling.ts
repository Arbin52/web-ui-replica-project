
import { useEffect, MutableRefObject, useRef, useCallback } from 'react';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  // Store the last fetch timestamp to prevent excessive updates
  const lastFetchTimestamp = useRef<number>(0);
  // Track if a fetch is in progress to prevent overlapping requests
  const fetchInProgress = useRef<boolean>(false);
  // Track consecutive errors to implement exponential backoff
  const errorCount = useRef<number>(0);
  
  // Create a stable fetch function that won't cause re-renders
  const throttledFetch = useCallback(async () => {
    // Skip if a fetch is already in progress
    if (fetchInProgress.current) {
      console.log('Skipping network fetch - previous fetch still in progress');
      return;
    }
    
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimestamp.current;
    
    // Increase minimum time between fetches to 2 seconds to reduce CPU usage
    if (timeSinceLastFetch < Math.max(2000, updateInterval * 0.5)) {
      return;
    }
    
    try {
      fetchInProgress.current = true;
      lastFetchTimestamp.current = now;
      
      // Use AbortController with a stricter timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log("Aborting network fetch due to timeout");
        abortController.abort();
      }, 2500); // Even shorter timeout to prevent UI freezing
      
      await fetchNetworkStatus();
      
      // Clear timeout and reset error count on success
      clearTimeout(timeoutId);
      errorCount.current = 0;
    } catch (err) {
      console.error('Error in network polling:', err);
      // Increment error count for exponential backoff
      errorCount.current++;
    } finally {
      fetchInProgress.current = false;
    }
  }, [fetchNetworkStatus, updateInterval]);
  
  // Setup polling effect with optimized performance
  useEffect(() => {
    // Clear any existing interval to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set up polling if live updates are enabled
    if (isLiveUpdating) {
      console.log('Setting up network polling with interval:', updateInterval);
      
      // Initial fetch with a longer delay to allow UI to render first
      const initialDelayMs = 1200;
      setTimeout(() => {
        if (!fetchInProgress.current) {
          throttledFetch();
        }
      }, initialDelayMs);
      
      // Use a fixed interval that's at least 5 seconds to reduce CPU usage
      const effectiveInterval = Math.max(5000, updateInterval);
      
      // Use setInterval with fixed timing to ensure more predictable behavior
      const intervalId = setInterval(() => {
        if (!document.hidden && !fetchInProgress.current) {
          throttledFetch();
        }
      }, effectiveInterval);
      
      intervalRef.current = intervalId;
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, throttledFetch, intervalRef]);
};
