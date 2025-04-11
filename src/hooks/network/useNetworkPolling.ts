
import { useEffect, MutableRefObject } from 'react';

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  // Setup/cleanup for the interval timer with proper dependency tracking
  useEffect(() => {
    // Initial fetch
    fetchNetworkStatus();
    
    // Set up polling for real-time updates if live updating is enabled
    if (isLiveUpdating) {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set a new interval
      intervalRef.current = setInterval(() => {
        fetchNetworkStatus();
      }, updateInterval);
    }
    
    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchNetworkStatus, isLiveUpdating, updateInterval, intervalRef]);

  // Monitor real network connection status using navigator.onLine and network change events
  useEffect(() => {
    return setupNetworkChangeListeners(fetchNetworkStatus);
  }, [fetchNetworkStatus]);

  // Additional effect to perform network status check whenever online status changes
  useEffect(() => {
    return setupMouseMoveListener(fetchNetworkStatus);
  }, [fetchNetworkStatus]);
};
