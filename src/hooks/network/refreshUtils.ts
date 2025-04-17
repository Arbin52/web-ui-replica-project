
// Contains utility functions for refreshing network status

// Schedule future network status checks with throttling
export const scheduleNetworkChecks = (
  checkFunction: () => void | Promise<void>,
  interval: number = 5000
) => {
  let lastCheck = Date.now();
  
  const throttledCheck = () => {
    const now = Date.now();
    if (now - lastCheck >= interval) {
      lastCheck = now;
      checkFunction();
    }
  };
  
  const checkId = setInterval(throttledCheck, interval);
  
  return () => {
    clearInterval(checkId);
  };
};

// Setup event listeners for potential network changes
export const setupNetworkChangeListeners = (
  onNetworkChange: () => void,
  cleanupFunction?: () => void
) => {
  // Use a debounce mechanism to prevent rapid firing
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  
  const debouncedOnChange = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onNetworkChange();
    }, 300); // 300ms debounce
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
      console.log("Page became visible, checking network status");
      debouncedOnChange();
    }
  };
  
  // Add event listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Try to detect network changes more accurately on supported browsers
  if ((navigator as any).connection) {
    const connection = (navigator as any).connection;
    
    const handleConnectionChange = () => {
      console.log("Network connection changed:", connection);
      debouncedOnChange();
    };
    
    connection.addEventListener('change', handleConnectionChange);
    
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

// Detect mouse movement to check for network changes (with extreme throttling)
export const setupMouseMoveListener = (
  onNetworkChange: () => void,
  throttleTime: number = 10000 // Increased to 10 seconds
) => {
  let lastChecked = Date.now();
  let isThrottled = false;
  
  const handleMouseMove = () => {
    if (isThrottled) return;
    
    const now = Date.now();
    if (now - lastChecked > throttleTime) {
      isThrottled = true;
      lastChecked = now;
      
      // Use requestIdleCallback if available
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          onNetworkChange();
          setTimeout(() => { isThrottled = false; }, 1000);
        });
      } else {
        setTimeout(() => {
          onNetworkChange();
          isThrottled = false;
        }, 0);
      }
    }
  };
  
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
};

// Optimize refresh rate based on network activity
export const optimizeRefreshRate = (
  currentUpdateInterval: number,
  networkStatus: any,
  setInterval: (ms: number) => void
) => {
  // If we're offline, slow down updates to save resources
  if (!networkStatus?.isOnline) {
    if (currentUpdateInterval < 5000) {
      console.log("Network offline, reducing update frequency");
      setInterval(5000);
    }
    return;
  }
  
  // If we're online but there's no activity, use moderate refresh rate
  const hasRecentActivity = networkStatus?.connectionHistory?.some((event: any) => {
    const eventTime = new Date(event.timestamp).getTime();
    return (Date.now() - eventTime) < 60000; // Activity in the last minute
  });
  
  if (!hasRecentActivity) {
    if (currentUpdateInterval < 2000) {
      console.log("No recent activity, using moderate update frequency");
      setInterval(2000);
    }
  }
};

// Function to check if browser supports network information API
export const supportsNetworkInformation = () => {
  return !!(navigator as any).connection;
};

// Get connection type if available
export const getConnectionType = () => {
  if ((navigator as any).connection) {
    const connection = (navigator as any).connection;
    return {
      type: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0
    };
  }
  
  return null;
};
