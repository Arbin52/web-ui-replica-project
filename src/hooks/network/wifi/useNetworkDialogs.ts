
import { useState } from 'react';

/**
 * Custom hook to manage WiFi network-related dialogs
 */
export const useNetworkDialogs = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNetworkNameDialog, setShowNetworkNameDialog] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<{id: number, ssid: string} | null>(null);
  const [password, setPassword] = useState('');
  const [customNetworkName, setCustomNetworkName] = useState('');
  
  // Handle opening the network edit dialog
  const handleEditNetworkName = () => {
    // When editing, start with the best name we have
    const startingName = localStorage.getItem('user_provided_network_name') || '';
                        
    // Don't use "Connected Network" or "Unknown Network" as starting values
    const cleanedName = startingName === "Connected Network" || startingName === "Unknown Network" 
                        ? "" 
                        : startingName;
                        
    setCustomNetworkName(cleanedName);
    setShowNetworkNameDialog(true);
  };

  return {
    showPasswordDialog,
    setShowPasswordDialog,
    showNetworkNameDialog,
    setShowNetworkNameDialog,
    selectedNetwork,
    setSelectedNetwork,
    password,
    setPassword,
    customNetworkName,
    setCustomNetworkName,
    handleEditNetworkName
  };
};
