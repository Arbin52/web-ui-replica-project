
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook to handle WiFi network connections
 */
export const useNetworkConnection = (
  connectToNetwork: (ssid: string, password: string) => Promise<boolean>,
  disconnectFromNetwork: () => Promise<boolean>,
  clearConnectionError: () => void,
  refreshNetworkStatus: () => Promise<void>,
  networkStatus: any
) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  // Calculate signal strength percentage from dBm value
  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  // Handle connecting to a network
  const handleSubmitPassword = async (selectedNetwork: {id: number, ssid: string}, password: string) => {
    if (!selectedNetwork) return false;
    
    setIsConnecting(true);
    
    try {
      const success = await connectToNetwork(selectedNetwork.ssid, password);
      if (success) {
        // Store as user-provided network name
        localStorage.setItem('user_provided_network_name', selectedNetwork.ssid);
        
        // Force immediate refresh after successful connection
        setTimeout(() => {
          void refreshNetworkStatus();
        }, 500);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Connection error:", error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnecting from a network
  const handleDisconnect = async () => {
    if (!networkStatus?.networkName) return;
    
    setIsDisconnecting(true);
    
    try {
      await disconnectFromNetwork();
    } catch (error) {
      console.error("Disconnection error:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };
  
  // Handle saving a custom network name - return Promise<boolean> to ensure consistent async handling
  const handleSaveNetworkName = useCallback(async (customNetworkName: string): Promise<boolean> => {
    if (customNetworkName.trim()) {
      localStorage.setItem('user_provided_network_name', customNetworkName.trim());
      
      // Apply changes immediately
      setTimeout(() => {
        void refreshNetworkStatus();
      }, 100);
      
      return true;
    }
    return false;
  }, [refreshNetworkStatus]);
  
  // Function to detect if current network is in available networks
  const checkIfCurrentNetworkIsInList = useCallback(() => {
    // If no network status, nothing to check
    if (!navigator.onLine || !networkStatus?.networkName) return;
    
    // Check if currently connected network is in the available networks list
    const currentNetworkInList = networkStatus.availableNetworks?.some(
      (network: any) => network.ssid === networkStatus.networkName
    );
    
    // If not in list, trigger a refresh to update the list
    if (!currentNetworkInList) {
      console.log("Current network not in available list, refreshing");
      void refreshNetworkStatus();
    }
  }, [networkStatus, refreshNetworkStatus]);

  // Check if current network is in list when network changes
  useEffect(() => {
    checkIfCurrentNetworkIsInList();
  }, [networkStatus?.networkName, checkIfCurrentNetworkIsInList]);

  // Reset error state when dialog closes
  useEffect(() => {
    clearConnectionError?.();
  }, [clearConnectionError]);
  
  return {
    isConnecting,
    isDisconnecting,
    getSignalStrength,
    handleSubmitPassword,
    handleDisconnect,
    handleSaveNetworkName
  };
};
