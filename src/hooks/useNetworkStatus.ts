
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface NetworkStatus {
  networkName: string;
  localIp: string;
  publicIp: string;
  gatewayIp: string;
  signalStrength: string;
  signalStrengthDb: string;
  networkType: string;
  macAddress: string;
  dnsServer: string;
  connectedDevices: {
    id: number;
    name: string;
    ip: string;
    mac: string;
    type: string;
  }[];
  lastUpdated: Date;
  isOnline: boolean;
  connectionSpeed: {
    download: number;
    upload: number;
    latency: number;
  };
  dataUsage?: {
    download: number; // in MB
    upload: number; // in MB
    total: number; // in MB
  };
  connectionHistory?: {
    timestamp: Date;
    status: 'connected' | 'disconnected';
  }[];
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000); // 5 seconds by default
  
  // This function fetches the real network information using browser APIs
  const fetchRealNetworkInfo = async (): Promise<Partial<NetworkStatus>> => {
    try {
      // Check if online
      const isOnline = navigator.onLine;
      
      // Get network information if available
      let networkType = "Unknown";
      let signalStrength = "Unknown";
      let signalStrengthDb = "Unknown";
      
      // Try to get connection information if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          networkType = connection.effectiveType || connection.type || "Unknown";
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
      
      // Get local network information
      // This is limited due to browser security restrictions
      // In a real app, you'd need a native app or browser extension for more details
      
      return {
        networkName: navigator.userAgent.includes("Win") ? "Windows Network" : 
                     navigator.userAgent.includes("Mac") ? "Mac Network" : 
                     navigator.userAgent.includes("Linux") ? "Linux Network" : 
                     navigator.userAgent.includes("Android") ? "Android Network" : 
                     navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") ? "iOS Network" : 
                     "My Network",
        isOnline,
        publicIp,
        networkType: networkType,
        lastUpdated: new Date()
      };
    } catch (err) {
      console.error("Error fetching real network info:", err);
      return {};
    }
  };

  const generateNetworkStatus = async (): Promise<NetworkStatus> => {
    // Try to get real network information where possible
    const realNetworkInfo = await fetchRealNetworkInfo();
    
    // Generate realistic dynamic values for what we can't get from the browser
    const signalStrengthDb = -(Math.floor(Math.random() * 30) + 50);
    const downloadSpeed = Math.floor(Math.random() * 30) + 70;
    const uploadSpeed = Math.floor(Math.random() * 10) + 15;
    const latency = Math.floor(Math.random() * 15) + 5;
    
    // Data usage simulated values
    const downloadData = Math.floor(Math.random() * 500) + 1000; // Between 1000-1500 MB
    const uploadData = Math.floor(Math.random() * 200) + 300; // Between 300-500 MB

    // Connection status history 
    const history = networkStatus?.connectionHistory || [];
    if (history.length > 20) history.shift(); // Keep only last 20 entries

    // Use real online status if available, otherwise simulate occasional disconnection
    const isCurrentlyOnline = realNetworkInfo.isOnline ?? (Math.random() > 0.01);
    
    // Add connection event if status changed
    if (networkStatus?.isOnline !== isCurrentlyOnline) {
      history.push({
        timestamp: new Date(),
        status: isCurrentlyOnline ? 'connected' : 'disconnected'
      });
      
      // Show toast notification on disconnection
      if (!isCurrentlyOnline) {
        toast.error("Network connection lost");
      } else if (networkStatus !== null) {
        // Only show reconnect toast if not first connection
        toast.success("Network connection restored");
      }
    }
    
    return {
      networkName: realNetworkInfo.networkName || 'MyNetwork',
      localIp: '192.168.1.2',
      publicIp: realNetworkInfo.publicIp || '203.0.113.1',
      gatewayIp: '192.168.1.1',
      signalStrength: signalStrengthDb > -60 ? 'Good' : signalStrengthDb > -70 ? 'Fair' : 'Poor',
      signalStrengthDb: `${signalStrengthDb} dBm`,
      networkType: realNetworkInfo.networkType || '802.11ac (5GHz)',
      macAddress: '00:1B:44:11:3A:B7',
      dnsServer: '8.8.8.8, 8.8.4.4',
      connectedDevices: [
        { id: 1, name: 'Desktop-PC', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wired' },
        { id: 2, name: 'iPhone-12', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' },
        { id: 3, name: 'Samsung-TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' },
        { id: 4, name: 'Smart-Speaker', ip: '192.168.1.6', mac: '00:1A:2B:3C:4D:61', type: 'Wireless' }
      ],
      lastUpdated: new Date(),
      isOnline: isCurrentlyOnline,
      connectionSpeed: {
        download: downloadSpeed,
        upload: uploadSpeed,
        latency: latency
      },
      dataUsage: {
        download: downloadData,
        upload: uploadData,
        total: downloadData + uploadData
      },
      connectionHistory: history
    };
  };

  const fetchNetworkStatus = useCallback(async () => {
    // In a real application, this would make API calls to get actual network data
    try {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate network status data with real information where possible
      const data = await generateNetworkStatus();
      
      setNetworkStatus(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching network status:', err);
      setError('Failed to fetch network status. Please try again.');
      toast.error('Failed to fetch network status');
    } finally {
      setIsLoading(false);
    }
  }, [networkStatus]);

  useEffect(() => {
    fetchNetworkStatus();
    
    // Set up polling for real-time updates if live updating is enabled
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isLiveUpdating) {
      intervalId = setInterval(() => {
        fetchNetworkStatus();
      }, updateInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchNetworkStatus, isLiveUpdating, updateInterval]);

  const refreshNetworkStatus = () => {
    setIsLoading(true);
    toast.info('Refreshing network status...');
    fetchNetworkStatus();
  };

  const toggleLiveUpdates = () => {
    setIsLiveUpdating(prev => !prev);
    toast.info(isLiveUpdating ? 'Live updates paused' : 'Live updates resumed');
  };

  const setRefreshRate = (ms: number) => {
    setUpdateInterval(ms);
    toast.info(`Update interval set to ${ms/1000} seconds`);
  };

  return {
    networkStatus,
    isLoading,
    error,
    refreshNetworkStatus,
    isLiveUpdating,
    toggleLiveUpdates,
    updateInterval,
    setRefreshRate
  };
};
