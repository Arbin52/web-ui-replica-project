
import { useState, useCallback } from 'react';

/**
 * Custom hook to handle network-related dialogs
 */
export const useNetworkDialogs = () => {
  // Password dialog state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<{id: number, ssid: string} | null>(null);
  const [password, setPassword] = useState('');
  
  // Network name dialog state
  const [showNetworkNameDialog, setShowNetworkNameDialog] = useState(false);
  const [customNetworkName, setCustomNetworkName] = useState('');
  
  // Handle network name editing - return Promise<void> to match expected type
  const handleEditNetworkName = useCallback(async (): Promise<void> => {
    // Get current network name if any
    const currentName = localStorage.getItem('user_provided_network_name') || '';
    setCustomNetworkName(currentName);
    setShowNetworkNameDialog(true);
  }, []);
  
  return {
    showPasswordDialog,
    setShowPasswordDialog,
    selectedNetwork,
    setSelectedNetwork,
    password,
    setPassword,
    showNetworkNameDialog,
    setShowNetworkNameDialog,
    customNetworkName,
    setCustomNetworkName,
    handleEditNetworkName
  };
};
