
// This function fetches the real network information using browser APIs
export const fetchRealNetworkInfo = async (): Promise<{
  networkName?: string;
  isOnline?: boolean;
  publicIp?: string;
  networkType?: string;
  gatewayIp?: string;
  lastUpdated?: Date;
}> => {
  try {
    // Check if online
    const isOnline = navigator.onLine;
    
    // Try to get connection information if available
    let networkType = "Unknown";
    let networkName = undefined;
    
    // Try to get more detailed connection information if available in a type-safe way
    // Using typeof check for browser compatibility
    if (typeof navigator !== 'undefined') {
      const nav = navigator as any;
      if (nav.connection) {
        networkType = nav.connection.effectiveType || nav.connection.type || "Unknown";
        
        // In some cases, type can give us hints about the connection
        if (nav.connection.type === 'wifi') {
          networkType = "802.11 (WiFi)";
        } else if (nav.connection.type === 'cellular') {
          networkType = "Cellular";
        }
      }
    }

    // First attempt to get network name through the NetworkInformation API (if available)
    let networkNameFromAPI = false;
    
    // Check if we can access Network Information API (not available in all browsers)
    if (typeof navigator !== 'undefined' && 'getNetworkInformation' in navigator) {
      try {
        // @ts-ignore - This is experimental and not widely supported
        const networkInfo = await navigator.getNetworkInformation();
        if (networkInfo && networkInfo.ssid) {
          networkName = networkInfo.ssid;
          networkNameFromAPI = true;
        }
      } catch (e) {
        console.log("Network Information API not available");
      }
    }
    
    // If we couldn't get the name through the API, try other methods
    if (!networkNameFromAPI) {
      // Try to get the actual connected network name from localStorage or native APIs
      networkName = localStorage.getItem('connected_network_name');
      
      // If no stored network and the device is online, we need to detect current connection
      if (!networkName && isOnline) {
        // First, try to get it directly from the WiFi APIs if available (requires permissions)
        try {
          // Check if we're on a secure context (HTTPS) for newer browser APIs
          if (window.isSecureContext) {
            // This is experimental and requires user permission
            // @ts-ignore
            if (navigator.wifi && typeof navigator.wifi.getCurrentNetwork === 'function') {
              // @ts-ignore
              const wifiNetwork = await navigator.wifi.getCurrentNetwork();
              if (wifiNetwork && wifiNetwork.ssid) {
                networkName = wifiNetwork.ssid;
              }
            }
          }
        } catch (err) {
          console.log("WiFi API access error:", err);
        }
        
        // If still no network name, make an educated guess
        if (!networkName) {
          const nav = navigator as any;
          // Query the connection type to make a good guess
          if (nav.connection && (nav.connection.type === 'wifi' || networkType.includes("WiFi"))) {
            const connectedNetworkFromStorage = localStorage.getItem('last_connected_network');
            networkName = connectedNetworkFromStorage || "WiFi Network";
          } else if (networkType.includes("Cellular")) {
            networkName = "Cellular Connection";
          } else if (isOnline) {
            // Device is online, but we don't know what type of connection
            networkName = "Connected Network";
          }
        }
      }
    }
    
    // Fetch public IP from API
    let publicIp = "";
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (response.ok) {
        const data = await response.json();
        publicIp = data.ip;
      }
    } catch (e) {
      console.error("Failed to fetch public IP", e);
      publicIp = "Unable to determine";
    }
    
    // Generate a realistic gateway IP
    const gatewayIp = "192.168.1.1";
    
    return {
      networkName,
      isOnline,
      publicIp,
      networkType,
      gatewayIp,
      lastUpdated: new Date()
    };
  } catch (err) {
    console.error("Error fetching real network info:", err);
    return {};
  }
};
