
// Contains utility functions for refreshing network status

// Schedule future network status checks
export const scheduleNetworkChecks = (
  checkFunction: () => void | Promise<void>,
  interval: number = 5000
) => {
  const checkId = setInterval(checkFunction, interval);
  
  return () => {
    clearInterval(checkId);
  };
};

// Setup event listeners for potential network changes
export const setupNetworkChangeListeners = (
  onNetworkChange: () => void,
  cleanupFunction?: () => void
) => {
  const handleOnline = () => {
    console.log("Browser reports online status change: ONLINE");
    onNetworkChange();
  };
  
  const handleOffline = () => {
    console.log("Browser reports online status change: OFFLINE");
    onNetworkChange();
  };
  
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      console.log("Page became visible, checking network status");
      onNetworkChange();
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
      onNetworkChange();
    };
    
    connection.addEventListener('change', handleConnectionChange);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      connection.removeEventListener('change', handleConnectionChange);
      
      if (cleanupFunction) cleanupFunction();
    };
  }
  
  // Cleanup
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    if (cleanupFunction) cleanupFunction();
  };
};

// Detect mouse movement to check for network changes
export const setupMouseMoveListener = (
  onNetworkChange: () => void,
  throttleTime: number = 5000
) => {
  let lastChecked = Date.now();
  
  const handleMouseMove = () => {
    const now = Date.now();
    if (now - lastChecked > throttleTime) {
      lastChecked = now;
      onNetworkChange();
    }
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
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
