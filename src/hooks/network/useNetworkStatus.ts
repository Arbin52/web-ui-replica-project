
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { generateNetworkStatus } from './networkStatusGenerator';
import { NetworkStatus } from './types';
import { connectNewDevice, disconnectDevice, getConnectedDeviceStatus, updateDeviceStatus } from './connectedDevices';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(500); // Even faster updates (500ms)
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Use a ref to store the interval ID to prevent it from being affected by state changes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Function to connect to a WiFi network
  const connectToNetwork = async (ssid: string, password: string) => {
    try {
      toast.info(`Connecting to ${ssid}...`);
      setConnectionError(null);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple password validation (in a real system, this would be done by the router)
      if (password.length < 8) {
        const errorMsg = `Failed to connect to ${ssid}: Invalid password (must be at least 8 characters)`;
        toast.error(errorMsg);
        setConnectionError(errorMsg);
        return false;
      }
      
      // Success! Store the connection info for detection
      localStorage.setItem('last_connected_network', ssid);
      localStorage.setItem('connected_network_name', ssid);
      localStorage.setItem('current_browser_network', ssid);
      
      // Update the network status after connecting
      await fetchNetworkStatus();
      
      // Simulate a new device connecting when the network changes
      connectNewDevice();
      
      toast.success(`Connected to ${ssid}`);
      return true;
    } catch (err) {
      console.error('Error connecting to network:', err);
      const errorMsg = `Failed to connect to ${ssid}: Network error`;
      toast.error(errorMsg);
      setConnectionError(errorMsg);
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
      
      const currentNetworkName = networkStatus.networkName;
      toast.info(`Disconnecting from ${currentNetworkName}...`);
      
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the stored network name
      localStorage.removeItem('last_connected_network');
      localStorage.removeItem('connected_network_name');
      localStorage.removeItem('current_browser_network');
      
      // Simulate a device disconnecting when the network changes
      disconnectDevice();
      
      // Update network status after disconnecting
      await fetchNetworkStatus();
      
      toast.success(`Disconnected from ${currentNetworkName}`);
      return true;
    } catch (err) {
      console.error('Error disconnecting from network:', err);
      toast.error('Failed to disconnect from network');
      return false;
    }
  };

  // Monitor real network connection status using navigator.onLine and network change events
  useEffect(() => {
    const handleOnline = () => {
      console.log("Browser reports online status change: ONLINE");
      toast.success("Your device is connected to the internet");
      fetchNetworkStatus();
    };
    
    const handleOffline = () => {
      console.log("Browser reports online status change: OFFLINE");
      toast.error("Your device lost internet connection");
      fetchNetworkStatus();
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Try to detect network changes more accurately on supported browsers
    if ((navigator as any).connection) {
      const connection = (navigator as any).connection;
      
      const handleConnectionChange = () => {
        console.log("Network connection changed:", connection);
        fetchNetworkStatus();
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchNetworkStatus]);

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

  // Additional effect to perform network status check whenever online status changes
  useEffect(() => {
    const checkNetworkOnVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Page became visible, checking network status");
        fetchNetworkStatus();
      }
    };
    
    // Listen for visibility changes to update when tab becomes active
    document.addEventListener('visibilitychange', checkNetworkOnVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', checkNetworkOnVisibilityChange);
    };
  }, [fetchNetworkStatus]);

  // Additional network detection through various browser events
  useEffect(() => {
    // Function to capture potential network changes
    const captureNetworkChange = () => {
      console.log("Potential network change detected, refreshing status");
      fetchNetworkStatus();
    };
    
    // Listen to various browser events that might indicate network changes
    window.addEventListener('focus', captureNetworkChange);
    window.addEventListener('blur', captureNetworkChange);
    
    // Listen to mouse movements as they could indicate user is active and network might have changed
    const handleMouseMove = (() => {
      let lastChecked = Date.now();
      const throttleTime = 5000; // Only check every 5 seconds at most
      
      return () => {
        const now = Date.now();
        if (now - lastChecked > throttleTime) {
          lastChecked = now;
          captureNetworkChange();
        }
      };
    })();
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('focus', captureNetworkChange);
      window.removeEventListener('blur', captureNetworkChange);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [fetchNetworkStatus]);

  const refreshNetworkStatus = () => {
    setIsLoading(true);
    console.log("Manual refresh requested");
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
  const checkCurrentNetworkImmediately = async () => {
    console.log("Immediate network check requested");
    return await fetchNetworkStatus();
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
    disconnectFromNetwork,
    simulateDeviceConnect,
    simulateDeviceDisconnect,
    getDeviceStatus,
    setDeviceStatus,
    connectionError,
    clearConnectionError,
    checkCurrentNetworkImmediately
  };
};
