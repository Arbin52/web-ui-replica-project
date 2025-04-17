
import { useEffect, MutableRefObject, useRef } from 'react';

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
      const scheduleFetch = async () => {
        // Skip if a fetch is already in progress
        if (fetchInProgress.current) {
          return;
        }
        
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTimestamp.current;
        
        // Rate limit fetches to prevent excessive updates
        if (timeSinceLastFetch < updateInterval * 0.8) {
          return;
        }
        
        // Check if the document is visible to save resources
        if (document.visibilityState !== 'visible') {
          return;
        }
        
        try {
          fetchInProgress.current = true;
          lastFetchTimestamp.current = now;
          await fetchNetworkStatus();
        } catch (err) {
          console.error('Error in network polling:', err);
        } finally {
          fetchInProgress.current = false;
        }
      };
      
      // Initial fetch when enabled, but with a slight delay to allow UI to render
      setTimeout(async () => {
        if (!fetchInProgress.current) {
          await scheduleFetch();
        }
      }, 100);
      
      // Use requestAnimationFrame for the first polling cycle to ensure smooth UI
      requestAnimationFrame(() => {
        // Set up the interval with the current refresh rate
        intervalRef.current = setInterval(scheduleFetch, updateInterval);
      });
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef]);
};
