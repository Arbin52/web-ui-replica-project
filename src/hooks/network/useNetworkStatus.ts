
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { generateNetworkStatus } from './networkStatusGenerator';
import { NetworkStatus } from './types';
import { 
  connectNewDevice, 
  disconnectDevice, 
  getConnectedDeviceStatus, 
  updateDeviceStatus 
} from './connectedDevices';
import { 
  connectToNetwork as connectToNetworkUtil, 
  disconnectFromNetwork as disconnectFromNetworkUtil 
} from './networkConnectionUtils';
import {
  scheduleNetworkChecks,
  setupNetworkChangeListeners,
  setupMouseMoveListener
} from './refreshUtils';
import { useNetworkPolling } from './useNetworkPolling';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(60000); // Changed to 1 minute (60000ms)
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Use a ref to store the interval ID to prevent it from being affected by state changes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Network status fetching function - moved before useNetworkPolling to fix the order issue
  const fetchNetworkStatus = useCallback(async () => {
    console.log("Fetching network status...");
    // In a real application, this would make API calls to get actual network data
    try {
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
  
  // Set up polling for network status - now this comes after fetchNetworkStatus is declared
  useNetworkPolling(isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef);

  // Function to connect to a WiFi network
  const connectToNetwork = async (ssid: string, password: string) => {
    try {
      setConnectionError(null);
      
      const result = await connectToNetworkUtil(ssid, password);
      
      if (!result.success) {
        setConnectionError(result.error || null);
        return false;
      }
      
      // Update the network status after connecting
      await fetchNetworkStatus();
      
      // Simulate a new device connecting when the network changes
      connectNewDevice();
      
      return true;
    } catch (err) {
      console.error('Error in connectToNetwork:', err);
      return false;
    }
  };

  // Function to disconnect from current network
  const disconnectFromNetwork = async () => {
    try {
      if (!networkStatus?.networkName) {
        toast.error('Not connected to any network');
        return false;
      }
      
      const success = await disconnectFromNetworkUtil(networkStatus.networkName);
      
      if (success) {
        // Simulate a device disconnecting when the network changes
        disconnectDevice();
        
        // Update network status after disconnecting
        await fetchNetworkStatus();
      }
      
      return success;
    } catch (err) {
      console.error('Error in disconnectFromNetwork:', err);
      return false;
    }
  };

  // Function to open router/gateway admin interface
  const openGatewayInterface = () => {
    if (networkStatus?.gatewayIp) {
      try {
        // Open gateway IP in new tab
        const gatewayUrl = `http://${networkStatus.gatewayIp}`;
        window.open(gatewayUrl, '_blank');
        toast.info('Opening router admin interface');
      } catch (error) {
        toast.error('Failed to open router interface');
        console.error('Error opening gateway URL:', error);
      }
    } else {
      toast.error('Gateway IP not available');
    }
  };

  const refreshNetworkStatus = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    console.log("Manual refresh requested");
    return fetchNetworkStatus();
  }, [fetchNetworkStatus]);

  const toggleLiveUpdates = () => {
    setIsLiveUpdating(prev => !prev);
    toast.info(!isLiveUpdating ? 'Live updates resumed' : 'Live updates paused');
  };

  const setRefreshRate = (ms: number) => {
    setUpdateInterval(ms);
    toast.info(`Update interval set to ${ms >= 60000 ? (ms/60000) + ' minute' + (ms === 60000 ? '' : 's') : (ms/1000) + ' seconds'}`);
  };

  // Simulate device connection/disconnection
  const simulateDeviceConnect = async () => {
    const newCount = connectNewDevice();
    toast.info(`New device connected to network (${newCount} devices total)`);
    await fetchNetworkStatus();
    return true;
  };
  
  const simulateDeviceDisconnect = async () => {
    const newCount = disconnectDevice();
    toast.info(`Device disconnected from network (${newCount} devices remaining)`);
    await fetchNetworkStatus();
    return true;
  };

  // Get actual device status
  const getDeviceStatus = () => {
    return getConnectedDeviceStatus();
  };

  // Update a specific device's status
  const setDeviceStatus = (deviceId: number, status: 'Online' | 'Offline') => {
    const updated = updateDeviceStatus(deviceId, status);
    if (updated) {
      fetchNetworkStatus();
    }
    return updated;
  };

  const clearConnectionError = () => {
    setConnectionError(null);
  };

  // Additional function to immediately check current network status (useful for UI events)
  const checkCurrentNetworkImmediately = useCallback(async (): Promise<void> => {
    console.log("Immediate network check requested");
    return fetchNetworkStatus();
  }, [fetchNetworkStatus]);

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
    disconnectFromNetwork,
    simulateDeviceConnect,
    simulateDeviceDisconnect,
    getDeviceStatus,
    setDeviceStatus,
    connectionError,
    clearConnectionError,
    checkCurrentNetworkImmediately,
    openGatewayInterface
  };
};
