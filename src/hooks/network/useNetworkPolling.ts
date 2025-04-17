
import { useEffect, MutableRefObject } from 'react';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
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
      // Use requestAnimationFrame for smooth performance
      const rafCallback = () => {
        if (document.visibilityState !== 'visible') {
          return; // Don't update when tab is not visible
        }
        
        fetchNetworkStatus().catch(err => {
          console.error('Error in network polling:', err);
        });
      };
      
      // Initial fetch when enabled
      rafCallback();
      
      // Set up the interval with the current refresh rate
      intervalRef.current = setInterval(rafCallback, updateInterval);
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveUpdating, updateInterval, fetchNetworkStatus]);
};
