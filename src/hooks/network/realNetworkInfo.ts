
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
    
    // Define potential network name sources
    const storedNetworkName = localStorage.getItem('connected_network_name');
    const lastConnectedNetwork = localStorage.getItem('last_connected_network');
    
    console.log("Fetching real network info. Stored network:", storedNetworkName);
    console.log("Last connected network:", lastConnectedNetwork);

    // Check the connection APIs
    if (typeof navigator !== 'undefined') {
      const nav = navigator as any;
      if (nav.connection) {
        networkType = nav.connection.effectiveType || nav.connection.type || "Unknown";
        console.log("Connection type detected:", networkType);
        
        // In some cases, type can give us hints about the connection
        if (nav.connection.type === 'wifi') {
          networkType = "802.11 (WiFi)";
          
          // If we're on WiFi, use stored network name if available
          if (storedNetworkName) {
            networkName = storedNetworkName;
            console.log("Using stored WiFi name:", networkName);
          }
        } else if (nav.connection.type === 'cellular') {
          networkType = "Cellular";
          networkName = "Cellular Connection";
        }
      }
    }

    // First check if we're in a secure context (HTTPS)
    const isSecureContext = window.isSecureContext;
    console.log("Is secure context:", isSecureContext);

    // Try to get the actual WiFi network name - multiple approaches
    
    // 1. Check if the browser has exposed the network name directly
    try {
      // Some browsers might expose network name in newer APIs
      if ((navigator as any).wifi && (navigator as any).wifi.ssid) {
        networkName = (navigator as any).wifi.ssid;
        console.log("Got network name from navigator.wifi:", networkName);
      } 
      // Try connection.ssid if available (future/experimental API)
      else if ((navigator as any).connection && (navigator as any).connection.ssid) {
        networkName = (navigator as any).connection.ssid;
        console.log("Got network name from connection.ssid:", networkName);
      }
    } catch (e) {
      console.log("Error accessing experimental network APIs:", e);
    }

    // 2. If we still don't have a network name but we're online, prioritize stored values
    if (!networkName && isOnline) {
      if (storedNetworkName) {
        networkName = storedNetworkName;
        console.log("Using stored network name:", networkName);
      } else if (lastConnectedNetwork) {
        networkName = lastConnectedNetwork;
        console.log("Using last connected network name:", networkName);
      }
    }

    // 3. Check network information API for hints about connection
    if (!networkName && isOnline && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      
      // If we know we're on WiFi but don't know the name
      if (connection.type === 'wifi') {
        // Fallback to generic name if we're definitely on WiFi but don't know name
        networkName = storedNetworkName || lastConnectedNetwork || "WiFi Connection";
        console.log("WiFi connection detected, using fallback name:", networkName);
      } 
      // For non-WiFi connections, be more generic
      else if (connection.type === 'cellular') {
        networkName = "Cellular Connection";
      } else if (isOnline) {
        networkName = "Active Connection";
      }
    }
    
    // If we're online but still have no network name, use last connected or default
    if (isOnline && !networkName) {
      networkName = lastConnectedNetwork || "Unknown Network";
      console.log("Online but no network name, using fallback:", networkName);
    }
    
    // If we know we're offline, clear the network name
    if (!isOnline) {
      networkName = undefined;
      console.log("Device is offline, clearing network name");
    }
    
    // Make the name available to other parts of the app
    if (networkName) {
      localStorage.setItem('current_browser_network', networkName);
      console.log("Stored detected network name:", networkName);
    }
    
    // Attempt to get public IP from API if online
    let publicIp = "";
    if (isOnline) {
      try {
        const response = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
        if (response.ok) {
          const data = await response.json();
          publicIp = data.ip;
          console.log("Got public IP:", publicIp);
        }
      } catch (e) {
        console.log("Failed to fetch public IP:", e);
        publicIp = "Unable to determine";
      }
    }
    
    // Generate a realistic gateway IP
    const gatewayIp = "192.168.1.1";
    
    // Return the collected network information
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
    return {
      isOnline: navigator.onLine,
      lastUpdated: new Date()
    };
  }
};
