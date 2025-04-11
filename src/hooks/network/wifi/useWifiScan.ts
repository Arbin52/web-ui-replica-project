
import { useState, useCallback } from 'react';

/**
 * Custom hook to handle WiFi network scanning
 */
export const useWifiScan = (
  refreshNetworkStatus: () => Promise<void>, 
  checkCurrentNetworkImmediately: () => Promise<void>
) => {
  const [scanInProgress, setScanInProgress] = useState(false);
  
  // Handle scanning for networks - ensure it returns Promise<void> properly
  const handleScanNetworks = useCallback(async (): Promise<void> => {
    setScanInProgress(true);
    
    // Do an immediate refresh
    await refreshNetworkStatus();
    
    // Check browser's network status after a short delay
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        console.log("Checking network status after scan");
        await checkCurrentNetworkImmediately();
        // Do one more check after a bit more time
        setTimeout(async () => {
          await checkCurrentNetworkImmediately();
          setScanInProgress(false);
          resolve();
        }, 1000);
      }, 1000);
    });
  }, [refreshNetworkStatus, checkCurrentNetworkImmediately]);

  return {
    scanInProgress,
    handleScanNetworks
  };
};
