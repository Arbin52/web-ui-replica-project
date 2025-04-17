import { useEffect, useRef, MutableRefObject } from 'react';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  // Keep track of last fetch time
  const lastFetchTime = useRef<number>(0);
  
  useEffect(() => {
    // Clean up any existing intervals immediately
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // If live updates are disabled, do nothing
    if (!isLiveUpdating) {
      return;
    }

    // Create a simple fetch function with minimum overhead
    const simpleFetch = async () => {
      // Skip if document is hidden to save resources
      if (document.visibilityState !== 'visible') {
        return;
      }
      
      // Enforce minimum interval between fetches (15 seconds)
      const now = Date.now();
      if (now - lastFetchTime.current < 15000) {
        return;
      }
      
      // Update last fetch time and execute fetch
      lastFetchTime.current = now;
      try {
        await fetchNetworkStatus();
      } catch (err) {
        console.error('Network fetch error:', err);
      }
    };

    // Initial fetch with delay to prevent initial load spike
    const initialTimeout = setTimeout(() => {
      simpleFetch();
    }, 1000);
    
    // Use fixed interval of at least 15 seconds
    const actualInterval = Math.max(15000, updateInterval);
    intervalRef.current = setInterval(simpleFetch, actualInterval);
    
    // Clean up function
    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef]);
};
