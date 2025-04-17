
import { useEffect, useRef, MutableRefObject } from 'react';
import { scheduleIdleTask } from '@/utils/performance';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  // Keep track of last fetch time
  const lastFetchTime = useRef<number>(0);
  const isInitialized = useRef<boolean>(false);
  const isPollingActive = useRef<boolean>(false);
  
  // Track visibility state
  const isVisible = useRef<boolean>(document.visibilityState === 'visible');
  
  // Clear any existing interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    // Set up visibility change detection with minimal overhead
    const handleVisibilityChange = () => {
      const wasVisible = isVisible.current;
      isVisible.current = document.visibilityState === 'visible';
      
      // Only trigger fetch if becoming visible and should be updating
      if (!wasVisible && isVisible.current && isLiveUpdating && Date.now() - lastFetchTime.current > 5000) {
        scheduleIdleTask(() => {
          if (document.visibilityState === 'visible') {
            fetchNetworkStatus().catch(err => console.error('Visibility fetch error:', err));
            lastFetchTime.current = Date.now();
          }
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up any existing intervals when deps change
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      isPollingActive.current = false;
    }
    
    // If live updates are disabled, do nothing more
    if (!isLiveUpdating) {
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // Create an optimized fetch function
    const optimizedFetch = async () => {
      // Only fetch if document is visible and polling is active
      if (!isVisible.current || !isPollingActive.current) {
        return;
      }
      
      // Enforce minimum interval between fetches (20 seconds)
      const now = Date.now();
      if (now - lastFetchTime.current < 20000) {
        return;
      }
      
      // Update last fetch time and execute fetch in idle time
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
        scheduleIdleTask(() => {
          if (document.visibilityState === 'visible') {
            optimizedFetch();
            isInitialized.current = true;
          }
        });
      }, 2000);
      
      // Clean up initial timeout if component unmounts before it runs
      return () => {
        clearTimeout(initialTimeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    
    // Use fixed interval of at least 20 seconds
    const actualInterval = Math.max(20000, updateInterval);
    isPollingActive.current = true;
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        scheduleIdleTask(optimizedFetch);
      }
    }, actualInterval);
    
    // Clean up function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingActive.current = false;
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef]);
};
