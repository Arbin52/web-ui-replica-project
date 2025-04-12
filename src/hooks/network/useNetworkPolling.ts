
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
  // Increased debounce time to 2000ms for smoother updates
  const debouncedFetch = debounce(fetchNetworkStatus, 2000);
  
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
      // Ensure minimum interval is respected to prevent too-rapid updates
      const effectiveInterval = Math.max(updateInterval, 60000); // Minimum 1 minute
      intervalRef.current = setInterval(() => {
        console.log(`Polling triggered at interval: ${effectiveInterval}ms`);
        fetchNetworkStatus();
      }, effectiveInterval);
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
  // Using a much higher debounce for mouse movement to prevent constant refreshing
  // Increased debounce threshold to reduce refresh frequency on mouse movement
  useEffect(() => {
    return setupMouseMoveListener(debouncedFetch, 15000); // Increased to 15 seconds
  }, [debouncedFetch]);
};
