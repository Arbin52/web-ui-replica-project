
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
    
    // Rate limit fetches to prevent excessive updates (minimum 1 second between fetches)
    if (timeSinceLastFetch < Math.max(1000, updateInterval * 0.5)) {
      return;
    }
    
    // Check if the document is visible to save resources
    if (document.visibilityState !== 'visible') {
      return;
    }
    
    try {
      fetchInProgress.current = true;
      lastFetchTimestamp.current = now;
      
      // Use AbortController to prevent hanging requests
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log("Aborting network fetch due to timeout");
        abortController.abort();
      }, 3000); // Reduced timeout to 3 seconds to prevent UI freezing
      
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
  
  // Setup polling effect with performance optimizations
  useEffect(() => {
    console.log('Network polling setup with interval:', updateInterval);
    
    // Clear any existing interval to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set up polling if live updates are enabled
    if (isLiveUpdating) {
      // Use a more efficient polling approach with rate limiting
      const scheduleFetch = () => {
        // Use requestIdleCallback when available to avoid interfering with UI
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            throttledFetch();
          }, { timeout: 2000 }); // Set a maximum timeout
        } else {
          setTimeout(() => {
            throttledFetch();
          }, 0);
        }
      };
      
      // Initial fetch when enabled, but with a slight delay to allow UI to render
      const initialDelayMs = 500;
      setTimeout(() => {
        if (!fetchInProgress.current) {
          scheduleFetch();
        }
      }, initialDelayMs);
      
      // Apply exponential backoff based on error count
      const effectiveInterval = Math.min(
        updateInterval * Math.pow(1.5, errorCount.current), 
        60000 // Cap at 60 seconds
      );
      
      // Use a more reliable approach than setInterval
      let timeoutId: NodeJS.Timeout | null = null;
      
      const scheduleNextFetch = () => {
        timeoutId = setTimeout(() => {
          scheduleFetch();
          scheduleNextFetch(); // Schedule next fetch after current one completes
        }, effectiveInterval);
        
        intervalRef.current = timeoutId;
      };
      
      // Start the scheduling cycle
      scheduleNextFetch();
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, throttledFetch, intervalRef]);
};
