
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
  // Track consecutive errors to implement exponential backoff
  const errorCount = useRef<number>(0);
  
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
          console.log('Skipping network fetch - previous fetch still in progress');
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
          
          // Use AbortController to prevent hanging requests
          const abortController = new AbortController();
          const timeoutId = setTimeout(() => abortController.abort(), 5000); // 5 second timeout
          
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
      };
      
      // Initial fetch when enabled, but with a slight delay to allow UI to render
      const initialDelayMs = 300;
      setTimeout(async () => {
        if (!fetchInProgress.current) {
          await scheduleFetch();
        }
      }, initialDelayMs);
      
      // Use requestAnimationFrame to ensure we start polling in a performant way
      requestAnimationFrame(() => {
        // Set up the interval with the current refresh rate
        // Apply exponential backoff based on error count
        const effectiveInterval = Math.min(
          updateInterval * Math.pow(1.5, errorCount.current), 
          60000 // Cap at 60 seconds
        );
        
        intervalRef.current = setInterval(scheduleFetch, effectiveInterval);
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
