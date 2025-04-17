
import { useEffect, MutableRefObject, useRef } from 'react';

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
  // Request abort controller
  const abortControllerRef = useRef<AbortController | null>(null);
  
  useEffect(() => {
    // Clear any existing interval to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Function to safely fetch network status
    const safeFetch = async () => {
      // Skip if a fetch is already in progress
      if (fetchInProgress.current) {
        console.log('Skipping network fetch - previous fetch still in progress');
        return;
      }
      
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTimestamp.current;
      
      // Enforce minimum time between fetches (5 seconds)
      if (timeSinceLastFetch < 5000) {
        return;
      }
      
      try {
        // Cancel any existing requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Create new abort controller with strict timeout
        abortControllerRef.current = new AbortController();
        fetchInProgress.current = true;
        lastFetchTimestamp.current = now;
        
        // Set a strict timeout to prevent UI freezing
        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            console.log("Aborting slow network fetch");
            abortControllerRef.current.abort();
          }
        }, 2000); // Very strict 2 second timeout
        
        // Use requestIdleCallback if available for better performance
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            fetchNetworkStatus().finally(() => {
              clearTimeout(timeoutId);
              fetchInProgress.current = false;
              abortControllerRef.current = null;
            });
          }, { timeout: 2000 });
        } else {
          await fetchNetworkStatus();
          clearTimeout(timeoutId);
          fetchInProgress.current = false;
          abortControllerRef.current = null;
        }
      } catch (err) {
        console.error('Error in network polling:', err);
        fetchInProgress.current = false;
        abortControllerRef.current = null;
      }
    };
    
    // Only set up polling if live updates are enabled
    if (isLiveUpdating) {
      // Use a fixed minimum interval of 10 seconds to reduce load
      const effectiveInterval = Math.max(10000, updateInterval);
      
      // Initial fetch with a delay to let UI render first
      const initialTimeout = setTimeout(() => {
        if (!fetchInProgress.current && document.visibilityState === 'visible') {
          safeFetch();
        }
      }, 1000);
      
      const intervalId = setInterval(() => {
        if (document.visibilityState === 'visible' && !fetchInProgress.current) {
          safeFetch();
        }
      }, effectiveInterval);
      
      intervalRef.current = intervalId;
      
      return () => {
        clearTimeout(initialTimeout);
        clearInterval(intervalId);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef]);
};
