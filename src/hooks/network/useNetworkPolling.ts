
import { useEffect, useRef, MutableRefObject } from 'react';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  // Keep track of last fetch time
  const lastFetchTime = useRef<number>(0);
  const isInitialized = useRef<boolean>(false);
  
  // Track visibility state
  const isVisible = useRef<boolean>(document.visibilityState === 'visible');
  
  useEffect(() => {
    // Set up visibility change detection
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible';
      
      // If becoming visible and should be updating, trigger fetch
      if (isVisible.current && isLiveUpdating && Date.now() - lastFetchTime.current > 5000) {
        fetchNetworkStatus().catch(err => console.error('Fetch error on visibility change:', err));
        lastFetchTime.current = Date.now();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Immediately clean up any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // If live updates are disabled, do nothing more
    if (!isLiveUpdating) {
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // Create a throttled fetch function to prevent excessive updates
    const throttledFetch = async () => {
      // Skip if document is hidden to save resources
      if (!isVisible.current) {
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

    // Delayed initial fetch to prevent initial load spike
    if (!isInitialized.current) {
      const initialTimeout = setTimeout(() => {
        throttledFetch();
        isInitialized.current = true;
      }, 1500);
      
      // Clean up initial timeout if component unmounts before it runs
      return () => {
        clearTimeout(initialTimeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    
    // Use fixed interval of at least 15 seconds
    const actualInterval = Math.max(15000, updateInterval);
    intervalRef.current = setInterval(throttledFetch, actualInterval);
    
    // Clean up function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef]);
};
