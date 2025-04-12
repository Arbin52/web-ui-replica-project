
import { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Import our modular hooks
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
  
  // Set refresh rate on component mount but disable automatic updates
  useEffect(() => {
    // Set refresh rate but we won't be using automatic updates
    setRefreshRate(60000);
    
    return () => {
      // Restore the same refresh rate when component unmounts
      setRefreshRate(60000);
    };
  }, [setRefreshRate]);
  
  // Initial detection of network status only once on mount
  useEffect(() => {
    const doInitialCheck = async () => {
      console.log("Doing initial network check");
      await refreshNetworkStatus();
      await detectRealNetworkName();
    };
    
    void doInitialCheck();
    
    // No automatic refresh intervals are set
    // Only manual refresh will be allowed
    
  }, [refreshNetworkStatus, detectRealNetworkName]);

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
