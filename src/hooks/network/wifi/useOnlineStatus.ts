
import { useState, useEffect } from 'react';

/**
 * Custom hook to track online status changes
 */
export const useOnlineStatus = (
  refreshNetworkStatus: () => Promise<void>,
  detectRealNetworkName: () => Promise<string | null>
) => {
  // Monitor navigator.onLine directly for immediate feedback
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = async () => {
      console.log("Online status changed:", navigator.onLine);
      setIsOnline(navigator.onLine);
      
      // Only refresh when the browser reports a state change
      // This is a system event, not an automatic refresh
      await refreshNetworkStatus();
      await detectRealNetworkName();
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
      const handleConnectionChange = async () => {
        console.log("Network connection type changed:", connection);
        // This is a system event, not an automatic refresh
        await refreshNetworkStatus();
        await detectRealNetworkName();
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, [refreshNetworkStatus, detectRealNetworkName]);

  return { isOnline };
};
