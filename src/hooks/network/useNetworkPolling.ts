
import { useEffect, MutableRefObject } from 'react';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  useEffect(() => {
    // Always clear any existing polling on component mount or deps change
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only setup polling if live updates are enabled
    if (!isLiveUpdating) {
      return;
    }

    // Use a simple flag in local scope to prevent concurrent fetches
    let isFetching = false;
    
    // Simplified fetch function with minimal overhead
    const safeFetch = async () => {
      // Skip if already fetching or document is hidden
      if (isFetching || document.visibilityState !== 'visible') {
        return;
      }
      
      try {
        isFetching = true;
        await fetchNetworkStatus();
      } catch (err) {
        console.error('Error fetching network status:', err);
      } finally {
        isFetching = false;
      }
    };

    // Execute initial fetch after a short delay to let the UI render
    const initialTimeout = setTimeout(() => {
      if (document.visibilityState === 'visible') {
        safeFetch();
      }
    }, 1000);
    
    // Use a much simpler interval mechanism with guaranteed minimum interval
    const minInterval = Math.max(15000, updateInterval); // Minimum 15 seconds
    intervalRef.current = setInterval(safeFetch, minInterval);
    
    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef]);
};
