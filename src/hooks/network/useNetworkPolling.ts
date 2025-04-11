
import { useEffect, MutableRefObject } from 'react';
import { setupNetworkChangeListeners, setupMouseMoveListener } from './refreshUtils';

// Create debounce utility function
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

export const useNetworkPolling = (
  isLiveUpdating: boolean,
  updateInterval: number,
  fetchNetworkStatus: () => Promise<void>,
  intervalRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  // Create a debounced version of the fetch function to prevent multiple rapid calls
  const debouncedFetch = debounce(fetchNetworkStatus, 500);
  
  // Setup/cleanup for the interval timer with proper dependency tracking
  useEffect(() => {
    // Initial fetch
    fetchNetworkStatus();
    
    // Clear any existing interval first to ensure we don't have multiple intervals running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Set up polling for real-time updates if live updating is enabled
    if (isLiveUpdating) {
      console.log(`Setting up polling with interval: ${updateInterval}ms`);
      
      // Set a new interval with the current updateInterval
      intervalRef.current = setInterval(() => {
        console.log(`Polling triggered at interval: ${updateInterval}ms`);
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
    return setupNetworkChangeListeners(debouncedFetch);
  }, [debouncedFetch]);

  // Additional effect to perform network status check whenever online status changes
  useEffect(() => {
    return setupMouseMoveListener(debouncedFetch);
  }, [debouncedFetch]);
};
