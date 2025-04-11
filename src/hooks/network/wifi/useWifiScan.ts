
import { useState, useCallback } from 'react';

/**
 * Custom hook to handle WiFi network scanning
 */
export const useWifiScan = (
  refreshNetworkStatus: () => Promise<void>, 
  checkCurrentNetworkImmediately: () => Promise<void>
) => {
  const [scanInProgress, setScanInProgress] = useState(false);
  
  // Handle scanning for networks - return Promise<void> to match expected type
  const handleScanNetworks = useCallback(async (): Promise<void> => {
    setScanInProgress(true);
    
    // Do an immediate refresh
    await refreshNetworkStatus();
    
    // Check browser's network status after a short delay
    setTimeout(async () => {
      console.log("Checking network status after scan");
      await checkCurrentNetworkImmediately();
      // Do one more check after a bit more time
      setTimeout(async () => {
        await checkCurrentNetworkImmediately();
        setScanInProgress(false);
      }, 1000);
    }, 1000);
  }, [refreshNetworkStatus, checkCurrentNetworkImmediately]);

  return {
    scanInProgress,
    handleScanNetworks
  };
};
