
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to track online status changes
 */
export const useOnlineStatus = (
  refreshNetworkStatus: () => Promise<void>,
  detectRealNetworkName: () => string | null
) => {
  // Monitor navigator.onLine directly for immediate feedback
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => {
      console.log("Online status changed:", navigator.onLine);
      setIsOnline(navigator.onLine);
      // Refresh network status when online state changes
      refreshNetworkStatus();
      detectRealNetworkName();
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [refreshNetworkStatus, detectRealNetworkName]);

  // Monitor real network connection changes if available
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const handleConnectionChange = () => {
        console.log("Network connection type changed:", connection);
        refreshNetworkStatus();
        detectRealNetworkName();
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, [refreshNetworkStatus, detectRealNetworkName]);

  return { isOnline };
};
