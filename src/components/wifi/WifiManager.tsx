
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import '../overview/index.css';

// Import our components
import CurrentConnection from './components/CurrentConnection';
import AvailableNetworks from './components/AvailableNetworks';
import NetworkDiagnostics from './components/NetworkDiagnostics';
import PasswordDialog from './components/PasswordDialog';
import StatusBar from './components/StatusBar';
import DeviceSimulation from './components/DeviceSimulation';
import NetworkNameDialog from './components/NetworkNameDialog';

const WifiManager: React.FC = () => {
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
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<{id: number, ssid: string} | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [detectedNetworkName, setDetectedNetworkName] = useState<string | null>(null);
  const [showNetworkNameDialog, setShowNetworkNameDialog] = useState(false);
  const [customNetworkName, setCustomNetworkName] = useState('');
  
  // Monitor navigator.onLine directly for immediate feedback
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Set a faster refresh rate on component mount
  useEffect(() => {
    // Use a 500ms refresh rate for truly real-time updates
    setRefreshRate(500);
    
    // Clean up function
    return () => {
      // Restore a more reasonable refresh rate when component unmounts
      setRefreshRate(5000);
    };
  }, [setRefreshRate]);
  
  // Enhanced network detection that runs more frequently
  const detectRealNetworkName = useCallback(() => {
    const userProvidedName = localStorage.getItem('user_provided_network_name');
    const detectedName = userProvidedName ||
                         localStorage.getItem('webrtc_detected_ssid') ||
                         localStorage.getItem('current_browser_network') || 
                         localStorage.getItem('connected_network_name') ||
                         localStorage.getItem('last_connected_network');
    
    if (detectedName && detectedName !== "Connected Network" && detectedName !== "Unknown Network") {
      console.log("Detected network name:", detectedName);
      setDetectedNetworkName(detectedName);
      return detectedName;
    }
    
    // If online but no name detected, prompt user to provide one
    if (navigator.onLine && (!detectedName || detectedName === "Connected Network" || detectedName === "Unknown Network")) {
      // Don't automatically show the dialog, but update the state to show we need user input
      if (!userProvidedName) {
        console.log("No network name detected but online - user input may be needed");
        return null;
      }
    }
    
    return detectedName;
  }, []);
  
  useEffect(() => {
    const handleOnlineStatus = () => {
      console.log("Online status changed:", navigator.onLine);
      setIsOnline(navigator.onLine);
      // Refresh network status when online state changes
      refreshNetworkStatus();
      detectRealNetworkName();
    };
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [refreshNetworkStatus, detectRealNetworkName]);

  // Monitor real network connection changes if available
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const handleConnectionChange = () => {
        console.log("Network connection type changed:", connection);
        refreshNetworkStatus();
        detectRealNetworkName();
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, [refreshNetworkStatus, detectRealNetworkName]);

  // Initial detection of network status + aggressive polling
  useEffect(() => {
    const doInitialCheck = async () => {
      console.log("Doing initial network check");
      await refreshNetworkStatus();
      detectRealNetworkName();
      
      // Try to detect network again after a short delay
      // This can help with detecting network after the page has fully loaded
      setTimeout(() => {
        checkCurrentNetworkImmediately();
        detectRealNetworkName();
      }, 1500);
    };
    
    doInitialCheck();
    
    // Real-time updates at 300ms intervals
    const fastUpdateInterval = setInterval(() => {
      checkCurrentNetworkImmediately();
      detectRealNetworkName();
    }, 300);
    
    // Additional periodic check with different timing to catch any missed updates
    const secondaryInterval = setInterval(() => {
      console.log("Secondary network check");
      refreshNetworkStatus();
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
  }, [networkStatus?.networkName]);

  // Reset error state when dialog closes
  useEffect(() => {
    if (!showPasswordDialog) {
      clearConnectionError?.();
    }
  }, [showPasswordDialog, clearConnectionError]);

  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleConnect = (network: {id: number, ssid: string}) => {
    setSelectedNetwork(network);
    setPassword('');  // Clear any previous password
    setShowPasswordDialog(true);
  };

  const handleScanNetworks = async () => {
    setScanInProgress(true);
    
    // Do an immediate refresh
    await refreshNetworkStatus();
    
    // Check browser's network status after a short delay
    setTimeout(async () => {
      console.log("Checking network status after scan");
      await checkCurrentNetworkImmediately();
      // Do one more check after a bit more time
      setTimeout(async () => {
        await checkCurrentNetworkImmediately();
        setScanInProgress(false);
      }, 1000);
    }, 1000);
  };

  const handleSubmitPassword = async () => {
    if (!selectedNetwork) return;
    
    setIsConnecting(true);
    
    try {
      const success = await connectToNetwork(selectedNetwork.ssid, password);
      if (success) {
        setShowPasswordDialog(false);
        setPassword('');
        setDetectedNetworkName(selectedNetwork.ssid);
        
        // Store as user-provided network name
        localStorage.setItem('user_provided_network_name', selectedNetwork.ssid);
        
        // Force immediate refresh after successful connection
        setTimeout(() => {
          refreshNetworkStatus();
        }, 500);
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!networkStatus?.networkName) return;
    
    setIsDisconnecting(true);
    
    try {
      await disconnectFromNetwork();
      setDetectedNetworkName(null);
    } catch (error) {
      console.error("Disconnection error:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleEditNetworkName = () => {
    // When editing, start with the best name we have
    const startingName = detectedNetworkName || 
                        networkStatus?.networkName || 
                        localStorage.getItem('user_provided_network_name') || 
                        '';
                        
    // Don't use "Connected Network" or "Unknown Network" as starting values
    const cleanedName = startingName === "Connected Network" || startingName === "Unknown Network" 
                        ? "" 
                        : startingName;
                        
    setCustomNetworkName(cleanedName);
    setShowNetworkNameDialog(true);
  };

  const handleSaveNetworkName = () => {
    if (customNetworkName.trim()) {
      localStorage.setItem('user_provided_network_name', customNetworkName.trim());
      setDetectedNetworkName(customNetworkName.trim());
      
      // Apply changes immediately
      setTimeout(() => {
        refreshNetworkStatus();
      }, 100);
    }
    setShowNetworkNameDialog(false);
  };

  // Calculate the actual number of available networks
  const availableNetworksCount = networkStatus?.availableNetworks?.length || 0;

  // Function to detect if current network is in available networks
  const checkIfCurrentNetworkIsInList = useCallback(() => {
    // If not online or no network status, nothing to check
    if (!isOnline || !networkStatus?.networkName) return;
    
    // Check if currently connected network is in the available networks list
    const currentNetworkInList = networkStatus.availableNetworks?.some(
      network => network.ssid === networkStatus.networkName
    );
    
    // If not in list, trigger a refresh to update the list
    if (!currentNetworkInList) {
      console.log("Current network not in available list, refreshing");
      refreshNetworkStatus();
    }
  }, [networkStatus, isOnline, refreshNetworkStatus]);

  // Check if current network is in list when component mounts or network changes
  useEffect(() => {
    checkIfCurrentNetworkIsInList();
  }, [networkStatus?.networkName, isOnline, checkIfCurrentNetworkIsInList]);

  // Calculate if we need to prompt for network name
  const shouldPromptForNetworkName = isOnline && 
                                     (!detectedNetworkName || 
                                      detectedNetworkName === "Unknown Network" || 
                                      detectedNetworkName === "Connected Network");

  return (
    <div className="space-y-6">
      <StatusBar 
        isOnline={isOnline}
        detectedNetworkName={detectedNetworkName}
        shouldPromptForNetworkName={shouldPromptForNetworkName}
        handleEditNetworkName={handleEditNetworkName}
      />
      
      <div className="flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleScanNetworks}
          disabled={scanInProgress}
          className="flex items-center gap-1"
        >
          {scanInProgress ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {scanInProgress ? 'Scanning...' : 'Scan Networks'}
        </Button>
        <DeviceSimulation 
          onConnectDevice={simulateDeviceConnect} 
          onDisconnectDevice={simulateDeviceDisconnect} 
        />
      </div>

      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Connection</TabsTrigger>
          <TabsTrigger value="available">Available Networks ({availableNetworksCount})</TabsTrigger>
          <TabsTrigger value="diagnostics">Network Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <CurrentConnection 
            networkStatus={networkStatus} 
            isLoading={isLoading}
            isDisconnecting={isDisconnecting}
            handleScanNetworks={handleScanNetworks}
            handleDisconnect={handleDisconnect}
            scanInProgress={scanInProgress}
            onEditNetworkName={handleEditNetworkName}
          />
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          <AvailableNetworks 
            networkStatus={networkStatus}
            isLoading={isLoading || scanInProgress}
            scanInProgress={scanInProgress}
            handleScanNetworks={handleScanNetworks}
            handleConnect={handleConnect}
            handleDisconnect={handleDisconnect}
            isDisconnecting={isDisconnecting}
            getSignalStrength={getSignalStrength}
          />
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-4">
          <NetworkDiagnostics networkStatus={networkStatus} />
        </TabsContent>
      </Tabs>

      <PasswordDialog
        showPasswordDialog={showPasswordDialog}
        setShowPasswordDialog={setShowPasswordDialog}
        selectedNetwork={selectedNetwork}
        password={password}
        setPassword={setPassword}
        handleSubmitPassword={handleSubmitPassword}
        isConnecting={isConnecting}
        error={connectionError}
      />

      <NetworkNameDialog
        open={showNetworkNameDialog}
        onOpenChange={setShowNetworkNameDialog}
        customNetworkName={customNetworkName}
        setCustomNetworkName={setCustomNetworkName}
        onSave={handleSaveNetworkName}
      />
    </div>
  );
};

export default WifiManager;
