import { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Import our new modular hooks
import { useWifiDetection } from './wifi/useWifiDetection';
import { useNetworkDialogs } from './wifi/useNetworkDialogs';
import { useWifiScan } from './wifi/useWifiScan';
import { useNetworkConnection } from './wifi/useNetworkConnection';
import { useOnlineStatus } from './wifi/useOnlineStatus';

export const useWifiManager = () => {
  const { 
    networkStatus, 
    isLoading, 
    refreshNetworkStatus,
    connectToNetwork,
    disconnectFromNetwork,
    simulateDeviceConnect,
    simulateDeviceDisconnect,
    connectionError,
    clearConnectionError,
    checkCurrentNetworkImmediately,
    setRefreshRate
  } = useNetworkStatus();
  
  // Use our modular hooks
  const { detectedNetworkName, setDetectedNetworkName, detectRealNetworkName, shouldPromptForNetworkName } = useWifiDetection();
  const { showPasswordDialog, setShowPasswordDialog, showNetworkNameDialog, setShowNetworkNameDialog, 
          selectedNetwork, setSelectedNetwork, password, setPassword, customNetworkName, setCustomNetworkName,
          handleEditNetworkName } = useNetworkDialogs();
  const { scanInProgress, handleScanNetworks } = useWifiScan(refreshNetworkStatus, checkCurrentNetworkImmediately);
  const { isConnecting, isDisconnecting, getSignalStrength, handleSubmitPassword, handleDisconnect, handleSaveNetworkName } = 
    useNetworkConnection(connectToNetwork, disconnectFromNetwork, clearConnectionError, refreshNetworkStatus, networkStatus);
  const { isOnline } = useOnlineStatus(refreshNetworkStatus, detectRealNetworkName);
  
  // Set a faster refresh rate on component mount
  useEffect(() => {
    // Use a 1-minute (60,000ms) refresh rate for stable updates
    setRefreshRate(60000);
    
    // Clean up function
    return () => {
      // Restore a more reasonable refresh rate when component unmounts
      setRefreshRate(60000);
    };
  }, [setRefreshRate]);
  
  // Initial detection of network status + aggressive polling
  useEffect(() => {
    const doInitialCheck = async () => {
      console.log("Doing initial network check");
      await refreshNetworkStatus();
      await detectRealNetworkName();
      
      // Try to detect network again after a short delay
      // This can help with detecting network after the page has fully loaded
      setTimeout(async () => {
        await checkCurrentNetworkImmediately();
        await detectRealNetworkName();
      }, 1500);
    };
    
    void doInitialCheck();
    
    // Real-time updates at 300ms intervals
    const fastUpdateInterval = setInterval(async () => {
      await checkCurrentNetworkImmediately();
      await detectRealNetworkName();
    }, 300);
    
    // Additional periodic check with different timing to catch any missed updates
    const secondaryInterval = setInterval(() => {
      console.log("Secondary network check");
      void refreshNetworkStatus();
    }, 2000);
    
    return () => {
      clearInterval(fastUpdateInterval);
      clearInterval(secondaryInterval);
    };
  }, [refreshNetworkStatus, checkCurrentNetworkImmediately, detectRealNetworkName]);

  // Update detected network name when network status changes
  useEffect(() => {
    if (networkStatus?.networkName && networkStatus.networkName !== 'Unknown Network' && networkStatus.networkName !== 'Connected Network') {
      setDetectedNetworkName(networkStatus.networkName);
    }
  }, [networkStatus?.networkName, setDetectedNetworkName]);

  const handleConnect = (network: {id: number, ssid: string}) => {
    setSelectedNetwork(network);
    setPassword('');  // Clear any previous password
    setShowPasswordDialog(true);
  };
  
  const handleSubmitPasswordWrapper = async () => {
    if (!selectedNetwork) return;
    const success = await handleSubmitPassword(selectedNetwork, password);
    if (success) {
      setShowPasswordDialog(false);
      setPassword('');
      setDetectedNetworkName(selectedNetwork.ssid);
    }
  };
  
  const handleSaveNetworkNameWrapper = async () => {
    const success = await handleSaveNetworkName(customNetworkName);
    if (success) {
      setDetectedNetworkName(customNetworkName);
    }
    setShowNetworkNameDialog(false);
  };

  // Calculate the actual number of available networks
  const availableNetworksCount = networkStatus?.availableNetworks?.length || 0;

  return {
    networkStatus,
    isLoading,
    isOnline,
    isConnecting,
    isDisconnecting,
    scanInProgress,
    selectedNetwork,
    password,
    showPasswordDialog,
    connectionError,
    detectedNetworkName,
    shouldPromptForNetworkName,
    customNetworkName,
    showNetworkNameDialog,
    availableNetworksCount,
    setPassword,
    setShowPasswordDialog,
    setCustomNetworkName,
    setShowNetworkNameDialog,
    handleConnect,
    handleDisconnect,
    handleScanNetworks,
    handleSubmitPassword: handleSubmitPasswordWrapper,
    handleEditNetworkName,
    handleSaveNetworkName: handleSaveNetworkNameWrapper,
    refreshNetworkStatus,
    getSignalStrength,
    simulateDeviceConnect,
    simulateDeviceDisconnect
  };
};
