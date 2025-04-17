
// Contains utility functions for refreshing network status with minimum resources
import { scheduleIdleTask } from '@/utils/performance';

// Schedule future network status checks with extreme throttling
export const scheduleNetworkChecks = (
  checkFunction: () => void | Promise<void>,
  interval: number = 20000 // Increased to 20 seconds minimum
) => {
  let lastCheck = Date.now();
  let isCheckScheduled = false;
  
  // Create throttled check that respects idle time
  const throttledCheck = () => {
    if (isCheckScheduled) return;
    
    const now = Date.now();
    if (now - lastCheck >= interval) {
      isCheckScheduled = true;
      lastCheck = now;
      
      // Use requestIdleCallback to avoid impacting UI performance
      scheduleIdleTask(() => {
        if (document.visibilityState === 'visible') {
          checkFunction();
        }
        isCheckScheduled = false;
      });
    }
  };
  
  const checkId = setInterval(throttledCheck, Math.max(20000, interval));
  
  return () => {
    clearInterval(checkId);
  };
};

// Setup event listeners for potential network changes with minimal overhead
export const setupNetworkChangeListeners = (
  onNetworkChange: () => void,
  cleanupFunction?: () => void
) => {
  // Use a debounce mechanism to prevent rapid firing
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastChangeTime = 0;
  const minTimeBetweenChecks = 10000; // 10 seconds minimum between checks
  
  const debouncedOnChange = () => {
    // Skip if last change was too recent
    const now = Date.now();
    if (now - lastChangeTime < minTimeBetweenChecks) {
      return;
    }
    
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      lastChangeTime = Date.now();
      // Use idle callback to avoid impacting UI
      scheduleIdleTask(onNetworkChange);
    }, 500); // 500ms debounce
  };
  
  const handleOnline = () => {
    console.log("Browser reports online status change: ONLINE");
    debouncedOnChange();
  };
  
  const handleOffline = () => {
    console.log("Browser reports online status change: OFFLINE");
    debouncedOnChange();
  };
  
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // Only check if we've been hidden for a while
      const now = Date.now();
      if (now - lastChangeTime > minTimeBetweenChecks) {
        console.log("Page became visible, checking network status");
        debouncedOnChange();
      }
    }
  };
  
  // Add event listeners with passive option for better performance
  window.addEventListener('online', handleOnline, { passive: true });
  window.addEventListener('offline', handleOffline, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
  
  // Try to detect network changes more accurately on supported browsers
  if ((navigator as any).connection) {
    const connection = (navigator as any).connection;
    
    const handleConnectionChange = () => {
      console.log("Network connection changed:", connection);
      debouncedOnChange();
    };
    
    connection.addEventListener('change', handleConnectionChange, { passive: true });
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      connection.removeEventListener('change', handleConnectionChange);
      
      if (debounceTimer) clearTimeout(debounceTimer);
      if (cleanupFunction) cleanupFunction();
    };
  }
  
  // Cleanup
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    if (debounceTimer) clearTimeout(debounceTimer);
    if (cleanupFunction) cleanupFunction();
  };
};

// Very optimized mouse movement detection - only trigger check after long periods of inactivity
export const setupMouseMoveListener = (
  onNetworkChange: () => void,
  throttleTime: number = 30000 // Increased to 30 seconds
) => {
  let lastChecked = Date.now();
  let isThrottled = false;
  let isScheduled = false;
  
  const handleMouseMove = () => {
    if (isThrottled || isScheduled) return;
    
    const now = Date.now();
    if (now - lastChecked > throttleTime) {
      isThrottled = true;
      isScheduled = true;
      
      // Use requestIdleCallback with generous timeout
      scheduleIdleTask(() => {
        onNetworkChange();
        isScheduled = false;
        
        // Long cooldown after checking
        setTimeout(() => {
          isThrottled = false;
          lastChecked = Date.now();
        }, 5000);
      }, { timeout: 5000 });
    }
  };
  
  // Use passive event listener for better performance
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
};

// Optimize refresh rate based on network activity and system conditions
export const optimizeRefreshRate = (
  currentUpdateInterval: number,
  networkStatus: any,
  setInterval: (ms: number) => void
) => {
  // If we're offline, slow down updates significantly to save resources
  if (!networkStatus?.isOnline) {
    if (currentUpdateInterval < 30000) { // 30 seconds
      console.log("Network offline, reducing update frequency");
      setInterval(30000);
    }
    return;
  }
  
  // If memory is constrained, reduce update frequency
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
    if (currentUpdateInterval < 20000) { // 20 seconds
      console.log("Low memory device, reducing update frequency");
      setInterval(20000);
    }
    return;
  }
  
  // If there's no recent activity, use moderate refresh rate
  const hasRecentActivity = networkStatus?.connectionHistory?.some((event: any) => {
    const eventTime = new Date(event.timestamp).getTime();
    return (Date.now() - eventTime) < 120000; // Activity in the last 2 minutes
  });
  
  if (!hasRecentActivity && currentUpdateInterval < 15000) {
    console.log("No recent activity, using moderate update frequency");
    setInterval(15000); // 15 seconds
  }
};

// Function to check if browser supports network information API
export const supportsNetworkInformation = (): boolean => {
  return !!(navigator as any).connection;
};

// Get connection type if available with minimal overhead
export const getConnectionType = () => {
  if (!(navigator as any).connection) {
    return null;
  }
  
  try {
    const connection = (navigator as any).connection;
    return {
      type: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0
    };
  } catch (e) {
    console.error("Error accessing connection information:", e);
    return null;
  }
};
