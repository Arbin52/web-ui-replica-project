
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { NetworkStatus } from './types';
import { fetchRealDevices, isScannerAvailable } from '../../services/networkScanner';
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
      // Check if scanner is available
      const { available } = await isScannerAvailable();
      if (!available) {
        throw new Error('Network scanner not available');
      }

      // Fetch real devices
      const devices = await fetchRealDevices();
      
      // Update network status with real device data
      const data: NetworkStatus = {
        networkName: navigator.onLine ? "Connected Network" : "Disconnected",
        localIp: '192.168.1.2', // This will be updated by the scanner
        publicIp: '203.0.113.1', // This will be updated by the scanner
        gatewayIp: '192.168.1.1', // This will be updated by the scanner
        signalStrength: 'Good',
        signalStrengthDb: '-55 dBm',
        networkType: '802.11ac (5GHz)',
        macAddress: devices[0]?.mac || '00:1B:44:11:3A:B7',
        dnsServer: '8.8.8.8, 8.8.4.4',
        connectedDevices: devices,
        lastUpdated: new Date(),
        isOnline: navigator.onLine,
        connectionSpeed: {
          download: 100,
          upload: 20,
          latency: 5
        },
        dataUsage: {
          download: 1500,
          upload: 500,
          total: 2000
        },
        connectionHistory: [],
        availableNetworks: []
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
  }, [setNetworkStatus, setError, setIsLoading]);
  
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

