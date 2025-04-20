
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { NetworkStatus } from './types';
import { generateNetworkStatus } from './networkStatusGenerator';
import { useNetworkStatusState } from './status/useNetworkStatusState';
import { useNetworkActions } from './actions/useNetworkActions';
import { useNetworkPolling } from './useNetworkPolling';
import { useDeviceActions } from './devices/useDeviceActions';
import { useConnectionErrorHandling } from './status/useConnectionErrorHandling';

export const useNetworkStatus = () => {
  // Core state from the dedicated state hook
  const {
    networkStatus,
    setNetworkStatus,
    isLoading,
    setIsLoading,
    error,
    setError,
    isLiveUpdating,
    setIsLiveUpdating,
    updateInterval,
    setUpdateInterval,
    autoConnectAttempted,
    setAutoConnectAttempted
  } = useNetworkStatusState();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch network status function
  const fetchNetworkStatus = useCallback(async () => {
    console.log("Fetching network status...");
    setIsLoading(true);
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
  }, [networkStatus, setNetworkStatus, setError, setIsLoading]);
  
  // Initial data fetch on mount
  useEffect(() => {
    fetchNetworkStatus();
  }, []);
  
  // Connection error handling
  const {
    connectionError,
    clearConnectionError,
    setConnectionError
  } = useConnectionErrorHandling();
  
  // Network actions
  const {
    connectToNetwork,
    disconnectFromNetwork,
    refreshNetworkStatus,
    openGatewayInterface,
    checkCurrentNetworkImmediately,
    toggleLiveUpdates,
    setRefreshRate
  } = useNetworkActions({
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
  });
  
  // Device-related actions
  const {
    simulateDeviceConnect,
    simulateDeviceDisconnect,
    getDeviceStatus,
    setDeviceStatus
  } = useDeviceActions(fetchNetworkStatus);

  // Setup polling effect
  useNetworkPolling(isLiveUpdating, updateInterval, fetchNetworkStatus, intervalRef);
  
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
    openGatewayInterface,
    autoConnectAttempted,
    setAutoConnectAttempted
  };
};
