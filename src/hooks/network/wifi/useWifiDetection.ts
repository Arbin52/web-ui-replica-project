
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle WiFi network name detection
 */
export const useWifiDetection = () => {
  const [detectedNetworkName, setDetectedNetworkName] = useState<string | null>(null);
  const [shouldPromptForNetworkName, setShouldPromptForNetworkName] = useState(false);
  
  // Detect the current network name from various sources - ensure it properly returns Promise<string | null>
  const detectRealNetworkName = useCallback(async (): Promise<string | null> => {
    const userProvidedName = localStorage.getItem('user_provided_network_name');
    const detectedName = userProvidedName ||
                        localStorage.getItem('webrtc_detected_ssid') ||
                        localStorage.getItem('current_browser_network') || 
                        localStorage.getItem('connected_network_name') ||
                        localStorage.getItem('last_connected_network');
    
    if (detectedName && detectedName !== "Connected Network" && detectedName !== "Unknown Network") {
      console.log("Detected network name:", detectedName);
      setDetectedNetworkName(detectedName);
      return detectedName;
    }
    
    // If online but no name detected, we might need user input
    if (navigator.onLine && (!detectedName || detectedName === "Connected Network" || detectedName === "Unknown Network")) {
      if (!userProvidedName) {
        console.log("No network name detected but online - user input may be needed");
        setShouldPromptForNetworkName(true);
        return null;
      }
    }
    
    return detectedName;
  }, []);
  
  // Check if we need to prompt for network name
  useEffect(() => {
    const checkPromptNeeded = () => {
      const isOnline = navigator.onLine;
      setShouldPromptForNetworkName(isOnline && 
        (!detectedNetworkName || 
          detectedNetworkName === "Unknown Network" || 
          detectedNetworkName === "Connected Network"));
    };
    
    checkPromptNeeded();
  }, [detectedNetworkName]);

  return {
    detectedNetworkName,
    setDetectedNetworkName,
    detectRealNetworkName,
    shouldPromptForNetworkName
  };
};
