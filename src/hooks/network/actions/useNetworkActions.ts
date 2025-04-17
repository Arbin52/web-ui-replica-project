
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { refreshNetworkStatusData } from '../refreshUtils';
import { NetworkStatus } from '../types';

interface NetworkActionsProps {
  fetchNetworkStatus: () => Promise<void>;
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setConnectionError: (error: string | null) => void;
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  isLiveUpdating: boolean;
  setIsLiveUpdating: (updating: boolean) => void;
  updateInterval: number;
  setUpdateInterval: (interval: number) => void;
}

export const useNetworkActions = ({
  fetchNetworkStatus,
  networkStatus,
  isLoading,
  setIsLoading,
  setConnectionError,
  intervalRef,
  isLiveUpdating,
  setIsLiveUpdating,
  updateInterval,
  setUpdateInterval
}: NetworkActionsProps) => {
  // Function to refresh network status
  const refreshNetworkStatus = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await fetchNetworkStatus();
    } catch (error) {
      console.error('Error refreshing network status:', error);
      setConnectionError('Failed to refresh network status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchNetworkStatus, isLoading, setIsLoading, setConnectionError]);

  // Function to connect to a network
  const connectToNetwork = useCallback(async (ssid: string, password?: string) => {
    console.log(`Connecting to network: ${ssid} with password: ${password ? '********' : 'none'}`);
    toast.info(`Connecting to ${ssid}...`);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store the network name as the last connected network
      localStorage.setItem('last_connected_network', ssid);
      localStorage.setItem('connected_network_name', ssid);
      
      // Refresh the network status to show the connection
      await fetchNetworkStatus();
      
      toast.success(`Connected to ${ssid}`, {
        description: "Your device is now connected to the network"
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting to network:', error);
      toast.error(`Failed to connect to ${ssid}`, {
        description: "Please check your password and try again"
      });
      return false;
    }
  }, [fetchNetworkStatus]);

  // Function to disconnect from a network
  const disconnectFromNetwork = useCallback(async () => {
    if (!networkStatus?.networkName) {
      toast.error('Not connected to any network');
      return false;
    }
    
    const networkName = networkStatus.networkName;
    toast.info(`Disconnecting from ${networkName}...`);
    
    try {
      // Simulate disconnect delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the connected network name
      localStorage.removeItem('connected_network_name');
      
      // Refresh the network status to show disconnected
      await fetchNetworkStatus();
      
      toast.success(`Disconnected from ${networkName}`);
      return true;
    } catch (error) {
      console.error('Error disconnecting from network:', error);
      toast.error(`Failed to disconnect from ${networkName}`);
      return false;
    }
  }, [networkStatus, fetchNetworkStatus]);

  // Function to immediately check current network
  const checkCurrentNetworkImmediately = useCallback(async () => {
    await refreshNetworkStatusData(fetchNetworkStatus);
  }, [fetchNetworkStatus]);

  // Function to toggle live updates
  const toggleLiveUpdates = useCallback(() => {
    if (isLiveUpdating) {
      // Stop auto-updates
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      toast.info('Live updates paused');
    } else {
      // Start auto-updates and do immediate refresh
      refreshNetworkStatus();
      toast.success(`Live updates activated (every ${updateInterval / 1000}s)`);
    }
    
    setIsLiveUpdating(!isLiveUpdating);
  }, [isLiveUpdating, setIsLiveUpdating, intervalRef, refreshNetworkStatus, updateInterval]);

  // Function to set refresh rate
  const setRefreshRate = useCallback((interval: number) => {
    setUpdateInterval(interval);
    
    // If auto-updating is on, restart with new interval
    if (isLiveUpdating && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchNetworkStatus, interval);
      toast.success(`Update frequency changed to ${interval / 1000}s`);
    }
  }, [setUpdateInterval, isLiveUpdating, intervalRef, fetchNetworkStatus]);
  
  // Track if router admin dialog is open
  const [isRouterAdminOpen, setIsRouterAdminOpen] = useState(false);
  
  // Function to open gateway interface in new tab
  const openGatewayInterface = useCallback(() => {
    if (!networkStatus?.gatewayIp) {
      toast.error('Gateway IP not available');
      return;
    }
    
    const isRealNetwork = networkStatus.publicIp !== '203.0.113.1';
    
    if (isRealNetwork) {
      // This is likely a real network, so open the actual gateway in a new tab
      window.open(`http://${networkStatus.gatewayIp}`, '_blank');
      toast.info('Opening router admin interface in new tab');
    } else {
      // Show mock router interface
      setIsRouterAdminOpen(true);
    }
  }, [networkStatus]);

  return {
    connectToNetwork,
    disconnectFromNetwork,
    refreshNetworkStatus,
    openGatewayInterface,
    checkCurrentNetworkImmediately,
    toggleLiveUpdates,
    setRefreshRate,
    isRouterAdminOpen,
    setIsRouterAdminOpen
  };
};
