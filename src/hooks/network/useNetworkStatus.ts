
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { generateNetworkStatus } from './networkStatusGenerator';
import { NetworkStatus } from './types';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000); // 5 seconds by default
  
  // Use a ref to store the interval ID to prevent it from being affected by state changes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchNetworkStatus = useCallback(async () => {
    // In a real application, this would make API calls to get actual network data
    try {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate network status data with real information where possible
      const data = await generateNetworkStatus(networkStatus);
      
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

  // Function to connect to a WiFi network (simulated)
  const connectToNetwork = async (ssid: string, password: string) => {
    try {
      toast.info(`Connecting to ${ssid}...`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would make API calls to your router/gateway
      // Update the network status after connecting
      await fetchNetworkStatus();
      
      toast.success(`Connected to ${ssid}`);
      return true;
    } catch (err) {
      console.error('Error connecting to network:', err);
      toast.error(`Failed to connect to ${ssid}`);
      return false;
    }
  };

  // Function to disconnect from current network (simulated)
  const disconnectFromNetwork = async () => {
    try {
      if (!networkStatus?.networkName) {
        toast.error('Not connected to any network');
        return false;
      }
      
      toast.info(`Disconnecting from ${networkStatus.networkName}...`);
      
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would make API calls to your router/gateway
      await fetchNetworkStatus();
      
      toast.success(`Disconnected from ${networkStatus.networkName}`);
      return true;
    } catch (err) {
      console.error('Error disconnecting from network:', err);
      toast.error('Failed to disconnect from network');
      return false;
    }
  };

  // Setup/cleanup for the interval timer with proper dependency tracking
  useEffect(() => {
    // Initial fetch
    fetchNetworkStatus();
    
    // Set up polling for real-time updates if live updating is enabled
    if (isLiveUpdating) {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set a new interval
      intervalRef.current = setInterval(() => {
        fetchNetworkStatus();
      }, updateInterval);
    }
    
    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchNetworkStatus, isLiveUpdating, updateInterval]);

  const refreshNetworkStatus = () => {
    setIsLoading(true);
    toast.info('Refreshing network status...');
    fetchNetworkStatus();
  };

  const toggleLiveUpdates = () => {
    setIsLiveUpdating(prev => !prev);
    toast.info(!isLiveUpdating ? 'Live updates resumed' : 'Live updates paused');
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
    setRefreshRate,
    connectToNetwork,
    disconnectFromNetwork
  };
};
