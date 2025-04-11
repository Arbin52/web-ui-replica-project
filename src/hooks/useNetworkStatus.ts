
import { useState, useEffect } from 'react';
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
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkStatus = async () => {
    // In a real application, this would make API calls to get actual network data
    // For this demo, we'll simulate network data
    
    try {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate some random values to simulate changing network conditions
      const signalStrengthDb = -(Math.floor(Math.random() * 30) + 50);
      const downloadSpeed = Math.floor(Math.random() * 30) + 70;
      const uploadSpeed = Math.floor(Math.random() * 10) + 15;
      const latency = Math.floor(Math.random() * 15) + 5;
      
      // Create simulated network status data
      const data: NetworkStatus = {
        networkName: 'MyNetwork',
        localIp: '192.168.1.2',
        publicIp: '203.0.113.1',
        gatewayIp: '192.168.1.1',
        signalStrength: signalStrengthDb > -60 ? 'Good' : signalStrengthDb > -70 ? 'Fair' : 'Poor',
        signalStrengthDb: `${signalStrengthDb} dBm`,
        networkType: '802.11ac (5GHz)',
        macAddress: '00:1B:44:11:3A:B7',
        dnsServer: '8.8.8.8, 8.8.4.4',
        connectedDevices: [
          { id: 1, name: 'Desktop-PC', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wired' },
          { id: 2, name: 'iPhone-12', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' },
          { id: 3, name: 'Samsung-TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' },
          { id: 4, name: 'Smart-Speaker', ip: '192.168.1.6', mac: '00:1A:2B:3C:4D:61', type: 'Wireless' }
        ],
        lastUpdated: new Date(),
        isOnline: true,
        connectionSpeed: {
          download: downloadSpeed,
          upload: uploadSpeed,
          latency: latency
        }
      };
      
      setNetworkStatus(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching network status:', err);
      setError('Failed to fetch network status. Please try again.');
      toast.error('Failed to fetch network status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkStatus();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchNetworkStatus();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const refreshNetworkStatus = () => {
    setIsLoading(true);
    toast.info('Refreshing network status...');
    fetchNetworkStatus();
  };

  return {
    networkStatus,
    isLoading,
    error,
    refreshNetworkStatus
  };
};
