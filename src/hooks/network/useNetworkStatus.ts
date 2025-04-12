
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

// We're not using automatic polling functions anymore
// import { useNetworkPolling } from './useNetworkPolling';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false); // Start with live updates off
  const [updateInterval, setUpdateInterval] = useState(60000); // 1 minute, but not used for auto updates
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchNetworkStatus = useCallback(async () => {
    console.log("Fetching network status...");
    try {
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
  
  // We're not using automatic polling anymore
  // useNetworkPolling(isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef);

  const connectToNetwork = async (ssid: string, password: string) => {
    try {
      setConnectionError(null);
      
      const result = await connectToNetworkUtil(ssid, password);
      
      if (!result.success) {
        setConnectionError(result.error || null);
        return false;
      }
      
      await fetchNetworkStatus();
      
      connectNewDevice();
      
      return true;
    } catch (err) {
      console.error('Error in connectToNetwork:', err);
      return false;
    }
  };

  const disconnectFromNetwork = async () => {
    try {
      if (!networkStatus?.networkName) {
        toast.error('Not connected to any network');
        return false;
      }
      
      const success = await disconnectFromNetworkUtil(networkStatus.networkName);
      
      if (success) {
        disconnectDevice();
        
        await fetchNetworkStatus();
      }
      
      return success;
    } catch (err) {
      console.error('Error in disconnectFromNetwork:', err);
      return false;
    }
  };

  const openGatewayInterface = () => {
    if (networkStatus?.gatewayIp) {
      try {
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
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set up a new interval if we're turning on live updates
    if (!isLiveUpdating) {
      toast.info('Live updates resumed');
      intervalRef.current = setInterval(() => {
        console.log("Auto-update interval triggered");
        fetchNetworkStatus();
      }, updateInterval);
    } else {
      toast.info('Live updates paused');
    }
  };

  const setRefreshRate = (ms: number) => {
    console.log(`Setting refresh rate to ${ms}ms (${ms/1000} seconds)`);
    setUpdateInterval(ms);
    
    // Update the interval if live updates are currently enabled
    if (isLiveUpdating && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        console.log("Auto-update interval triggered with new rate");
        fetchNetworkStatus();
      }, ms);
    }
    
    toast.info(`Update interval set to ${ms >= 60000 ? (ms/60000) + ' minute' + (ms === 60000 ? '' : 's') : (ms/1000) + ' seconds'}`);
  };

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

  const getDeviceStatus = () => {
    return getConnectedDeviceStatus();
  };

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
