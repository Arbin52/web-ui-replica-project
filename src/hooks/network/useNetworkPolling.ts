
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
  const isFetchPending = useRef<boolean>(false);
  
  // Track visibility state
  const isVisible = useRef<boolean>(document.visibilityState === 'visible');
  // Track network state
  const wasOnline = useRef<boolean>(navigator.onLine);
  
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
      if (!wasVisible && isVisible.current && isLiveUpdating && Date.now() - lastFetchTime.current > 10000) {
        // Only schedule if no fetch is currently pending
        if (!isFetchPending.current) {
          isFetchPending.current = true;
          scheduleIdleTask(() => {
            if (document.visibilityState === 'visible') {
              fetchNetworkStatus()
                .catch(err => console.error('Visibility fetch error:', err))
                .finally(() => {
                  lastFetchTime.current = Date.now();
                  isFetchPending.current = false;
                });
            } else {
              isFetchPending.current = false;
            }
          });
        }
      }
    };
    
    // Set up online/offline detection
    const handleOnlineStatusChange = () => {
      const isOnline = navigator.onLine;
      if (wasOnline.current !== isOnline) {
        wasOnline.current = isOnline;
        
        // Only fetch if online status changed and we're visible
        if (isVisible.current && !isFetchPending.current) {
          isFetchPending.current = true;
          // Add slight delay to allow network to stabilize
          setTimeout(() => {
            scheduleIdleTask(() => {
              fetchNetworkStatus()
                .catch(err => console.error('Network status change fetch error:', err))
                .finally(() => {
                  lastFetchTime.current = Date.now();
                  isFetchPending.current = false;
                });
            });
          }, 1000);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
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
        window.removeEventListener('online', handleOnlineStatusChange);
        window.removeEventListener('offline', handleOnlineStatusChange);
      };
    }

    // Create an optimized fetch function that respects visibility and online status
    const optimizedFetch = async () => {
      // Skip if a fetch is already pending
      if (isFetchPending.current) {
        return;
      }
      
      // Skip if document is not visible or polling is not active
      if (!isVisible.current || !isPollingActive.current) {
        return;
      }
      
      // Enforce minimum interval between fetches (30 seconds)
      const now = Date.now();
      if (now - lastFetchTime.current < 30000) {
        return;
      }
      
      // Mark as pending to prevent concurrent fetches
      isFetchPending.current = true;
      
      try {
        // Execute fetch in idle time
        await new Promise<void>(resolve => {
          scheduleIdleTask(async () => {
            try {
              if (document.visibilityState === 'visible') {
                await fetchNetworkStatus();
              }
              resolve();
            } catch (err) {
              console.error('Network fetch error:', err);
              resolve();
            }
          });
        });
      } finally {
        lastFetchTime.current = Date.now();
        isFetchPending.current = false;
      }
    };

    // Delayed initial fetch to prevent initial load spike
    if (!isInitialized.current) {
      const initialTimeout = setTimeout(() => {
        if (isVisible.current && !isFetchPending.current) {
          isFetchPending.current = true;
          scheduleIdleTask(() => {
            if (document.visibilityState === 'visible') {
              optimizedFetch()
                .finally(() => {
                  isInitialized.current = true;
                  isFetchPending.current = false;
                });
            } else {
              isInitialized.current = true;
              isFetchPending.current = false;
            }
          });
        } else {
          isInitialized.current = true;
        }
      }, 3000);
      
      // Clean up initial timeout if component unmounts before it runs
      return () => {
        clearTimeout(initialTimeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('online', handleOnlineStatusChange);
        window.removeEventListener('offline', handleOnlineStatusChange);
      };
    }
    
    // Use fixed interval of at least 30 seconds
    const actualInterval = Math.max(30000, updateInterval);
    isPollingActive.current = true;
    
    // Use a more efficient polling mechanism with built-in throttling
    intervalRef.current = setInterval(() => {
      // Only attempt fetch if visible and not already pending
      if (isVisible.current && !isFetchPending.current) {
        scheduleIdleTask(optimizedFetch);
      }
    }, actualInterval);
    
    // Clean up function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingActive.current = false;
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef]);
};
