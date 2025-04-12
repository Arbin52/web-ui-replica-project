
import { useEffect, MutableRefObject } from 'react';
import { setupNetworkChangeListeners, setupMouseMoveListener } from './refreshUtils';

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
  const debouncedFetch = debounce(fetchNetworkStatus, 2000);
  
  useEffect(() => {
    fetchNetworkStatus();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isLiveUpdating) {
      console.log(`Setting up polling with interval: ${updateInterval}ms`);
      
      // Ensure minimum interval of 1 minute, maximum of 5 minutes
      const effectiveInterval = Math.max(60000, Math.min(updateInterval, 300000));
      
      intervalRef.current = setInterval(() => {
        console.log(`Polling triggered at interval: ${effectiveInterval}ms`);
        fetchNetworkStatus();
      }, effectiveInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchNetworkStatus, isLiveUpdating, updateInterval, intervalRef]);

  useEffect(() => {
    return setupNetworkChangeListeners(debouncedFetch);
  }, [debouncedFetch]);

  useEffect(() => {
    return setupMouseMoveListener(debouncedFetch, 15000); // 15 seconds
  }, [debouncedFetch]);
};

