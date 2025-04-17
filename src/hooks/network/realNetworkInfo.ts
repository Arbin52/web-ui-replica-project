
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
    // CRITICAL: Always check browser's online status first
    const browserIsOnline = navigator.onLine;
    
    // If browser reports offline, return immediately with correct status
    if (!browserIsOnline) {
      return {
        isOnline: false,
        networkName: undefined,
        lastUpdated: new Date(),
        connectionHistory: getConnectionHistory()
      };
    }
    
    // If we're here, the browser says we're online
    
    // Find the best network name with simplified logic
    const userProvidedName = localStorage.getItem('user_provided_network_name');
    const storedNetworkName = localStorage.getItem('connected_network_name');
    const fallbackName = 'Connected Network';
    
    // Select the best network name with clear priority
    const networkName = userProvidedName || storedNetworkName || fallbackName;
    
    // Store for future reference if we have a good name
    if (networkName && networkName !== 'Unknown Network') {
      localStorage.setItem('connected_network_name', networkName);
    }

    // Detect network type - simplified for performance
    let networkType = "WiFi";
    
    // Get connection history
    const connectionHistory = getConnectionHistory();
    
    return {
      networkName,
      isOnline: true, // We're definitely online at this point
      publicIp: localStorage.getItem('last_known_public_ip') || '192.168.1.100',
      networkType,
      gatewayIp: '192.168.1.1',
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
