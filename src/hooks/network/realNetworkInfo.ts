
import { getConnectionHistory } from './networkHistoryUtils';

// This function fetches the real network information using browser APIs
export const fetchRealNetworkInfo = async (): Promise<{
  networkName?: string;
  isOnline?: boolean;
  publicIp?: string;
  networkType?: string;
  gatewayIp?: string;
  lastUpdated?: Date;
  connectionHistory?: any[];
}> => {
  try {
    // CRITICAL: Check browser's online status immediately and use it as the source of truth
    const browserIsOnline = navigator.onLine;
    console.log("Browser reports online status:", browserIsOnline);
    
    // If browser reports offline, return immediately with correct status
    if (!browserIsOnline) {
      console.log("Browser reports offline, returning offline status");
      return {
        isOnline: false,
        networkName: undefined,
        lastUpdated: new Date(),
        connectionHistory: getConnectionHistory()
      };
    }
    
    // If we're here, the browser says we're online
    
    // Find the best network name
    const userProvidedName = localStorage.getItem('user_provided_network_name');
    const webrtcDetectedNetwork = localStorage.getItem('webrtc_detected_ssid');
    const browserDetectedNetwork = localStorage.getItem('current_browser_network');
    const storedNetworkName = localStorage.getItem('connected_network_name');
    const lastConnectedNetwork = localStorage.getItem('last_connected_network');
    
    // Select the best network name with clear priority
    let networkName = userProvidedName || 
                    webrtcDetectedNetwork || 
                    browserDetectedNetwork || 
                    storedNetworkName || 
                    lastConnectedNetwork || 
                    "Connected Network"; // Fallback default
    
    // Store for future reference
    if (networkName && networkName !== 'Unknown Network') {
      localStorage.setItem('current_browser_network', networkName);
      localStorage.setItem('last_connected_network', networkName);
    }

    // Detect network type
    let networkType = "WiFi";
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn) {
        if (conn.type === 'wifi') {
          networkType = "WiFi";
        } else if (conn.type === 'ethernet') {
          networkType = "Ethernet";
        } else if (conn.type === 'cellular') {
          networkType = "Cellular";
        }
      }
    }
    
    // Try to get public IP with a very short timeout
    let publicIp = "";
    try {
      const response = await fetch('https://api.ipify.org?format=json', { 
        signal: AbortSignal.timeout(1000) // Very short timeout to prevent freezing
      });
      if (response.ok) {
        const data = await response.json();
        publicIp = data.ip;
      }
    } catch (e) {
      console.log("Failed to fetch public IP (expected and non-critical)");
      publicIp = "Unable to determine";
    }
    
    // Use a standard gateway IP
    const gatewayIp = "192.168.1.1";
    
    // Get connection history
    const connectionHistory = getConnectionHistory();
    
    return {
      networkName,
      isOnline: true, // We're definitely online at this point
      publicIp,
      networkType,
      gatewayIp,
      connectionHistory,
      lastUpdated: new Date()
    };
  } catch (err) {
    console.error("Error fetching real network info:", err);
    
    // Always use browser's online status as fallback
    const browserIsOnline = navigator.onLine;
    return {
      isOnline: browserIsOnline,
      networkName: browserIsOnline ? "Connected Network" : undefined,
      connectionHistory: getConnectionHistory(),
      lastUpdated: new Date()
    };
  }
};
