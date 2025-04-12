
import { useCallback } from 'react';
import { toast } from 'sonner';
import { NetworkStatus } from '../types';
import { 
  connectToNetwork as connectToNetworkUtil, 
  disconnectFromNetwork as disconnectFromNetworkUtil,
  getCurrentNetworkName
} from '../networkConnectionUtils';

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
  
  const connectToNetwork = async (ssid: string, password: string) => {
    try {
      setConnectionError(null);
      
      const result = await connectToNetworkUtil(ssid, password);
      
      if (!result.success) {
        setConnectionError(result.error || null);
        return false;
      }
      
      await fetchNetworkStatus();
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
  }, [fetchNetworkStatus, setIsLoading]);

  const toggleLiveUpdates = () => {
    // Here's the fix: using a direct boolean value instead of a function
    const newIsLiveUpdating = !isLiveUpdating;
    setIsLiveUpdating(newIsLiveUpdating);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set up a new interval if we're turning on live updates
    if (newIsLiveUpdating) {
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
    
    // Only show toast for significant changes (over 1 minute difference)
    if (Math.abs(ms - updateInterval) > 60000) {
      toast.info(`Update interval set to ${ms >= 60000 ? (ms/60000) + ' minute' + (ms === 60000 ? '' : 's') : (ms/1000) + ' seconds'}`);
    }
  };

  const checkCurrentNetworkImmediately = useCallback(async (): Promise<void> => {
    console.log("Immediate network check requested");
    return fetchNetworkStatus();
  }, [fetchNetworkStatus]);

  return {
    connectToNetwork,
    disconnectFromNetwork,
    openGatewayInterface,
    refreshNetworkStatus,
    toggleLiveUpdates,
    setRefreshRate,
    checkCurrentNetworkImmediately
  };
};
