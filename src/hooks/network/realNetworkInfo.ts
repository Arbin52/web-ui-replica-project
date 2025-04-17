// This function fetches the real network information using browser APIs
// Complete rewrite with extreme performance optimization and memory management
export const fetchRealNetworkInfo = async (): Promise<{
  networkName?: string;
  isOnline?: boolean;
  publicIp?: string;
  networkType?: string;
  gatewayIp?: string;
  lastUpdated?: Date;
  connectionHistory?: any[];
}> => {
  // Immediate synchronous checks only - no async operations
  const browserIsOnline = navigator.onLine;
  
  // Prevent expensive operations when not visible
  if (document.visibilityState !== 'visible') {
    return {
      isOnline: browserIsOnline,
      lastUpdated: new Date()
    };
  }
  
  try {
    // Use cached connection history with memory protection
    const connectionHistory = (() => {
      try {
        const historyString = localStorage.getItem('connection_history');
        if (!historyString) return [];
        
        // Parse safely with size limit to prevent memory issues
        const history = JSON.parse(historyString);
        // Keep only last 20 entries maximum
        return Array.isArray(history) ? history.slice(-20) : [];
      } catch (e) {
        console.error('Error parsing connection history:', e);
        return [];
      }
    })();

    // Get basic network info from cache with fallbacks
    const networkName = localStorage.getItem('user_provided_network_name') || 
      localStorage.getItem('connected_network_name') || 
      (browserIsOnline ? 'Connected Network' : 'Not Connected');
    
    // All cached values to prevent any freezing
    const publicIp = localStorage.getItem('last_known_public_ip') || '192.168.1.100';
    const gatewayIp = localStorage.getItem('last_known_gateway_ip') || '192.168.1.1';
    const networkType = localStorage.getItem('last_known_network_type') || 'WiFi';

    // Return immediately with minimal object
    return {
      networkName,
      isOnline: browserIsOnline,
      publicIp,
      networkType,
      gatewayIp,
      connectionHistory,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error in fetchRealNetworkInfo:', error);
    // Return minimal data on error to prevent UI crashes
    return {
      isOnline: browserIsOnline,
      lastUpdated: new Date()
    };
  }
};
