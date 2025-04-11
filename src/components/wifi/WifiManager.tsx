
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { Smartphone, WifiOff, RefreshCw } from 'lucide-react';
import '../overview/index.css';

// Import our components
import CurrentConnection from './components/CurrentConnection';
import AvailableNetworks from './components/AvailableNetworks';
import NetworkDiagnostics from './components/NetworkDiagnostics';
import PasswordDialog from './components/PasswordDialog';

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
    clearConnectionError
  } = useNetworkStatus();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<{id: number, ssid: string} | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [scanInProgress, setScanInProgress] = useState(false);

  // Monitor navigator.onLine directly for immediate feedback
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      // Refresh network status when online state changes
      refreshNetworkStatus();
    };
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [refreshNetworkStatus]);

  // Monitor real network connection changes if available
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const handleConnectionChange = () => {
        console.log("Network connection type changed");
        refreshNetworkStatus();
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, [refreshNetworkStatus]);

  // Periodically check the connection status
  useEffect(() => {
    const connectionCheck = setInterval(() => {
      const networkName = localStorage.getItem('connected_network_name');
      if (networkName && !isConnecting && !isDisconnecting) {
        refreshNetworkStatus();
      }
    }, 2000); // Check more frequently

    return () => clearInterval(connectionCheck);
  }, [isConnecting, isDisconnecting, refreshNetworkStatus]);

  // Reset error state when dialog closes
  useEffect(() => {
    if (!showPasswordDialog) {
      clearConnectionError?.();
    }
  }, [showPasswordDialog, clearConnectionError]);

  // Initial fetch on component load
  useEffect(() => {
    refreshNetworkStatus();
  }, []);

  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleConnect = (network: {id: number, ssid: string}) => {
    setSelectedNetwork(network);
    setPassword('');  // Clear any previous password
    setShowPasswordDialog(true);
  };

  const handleScanNetworks = () => {
    setScanInProgress(true);
    toast.info("Scanning for WiFi networks...");
    
    refreshNetworkStatus();
    
    // Simulate scanning completion
    setTimeout(() => {
      setScanInProgress(false);
      toast.success("Network scan complete");
    }, 3000);
  };

  const handleSubmitPassword = async () => {
    if (!selectedNetwork) return;
    
    setIsConnecting(true);
    
    try {
      const success = await connectToNetwork(selectedNetwork.ssid, password);
      if (success) {
        setShowPasswordDialog(false);
        setPassword('');
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error(`Failed to connect to ${selectedNetwork.ssid}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!networkStatus?.networkName) return;
    
    setIsDisconnecting(true);
    
    try {
      await disconnectFromNetwork();
    } catch (error) {
      console.error("Disconnection error:", error);
      toast.error("Failed to disconnect from network");
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Calculate the actual number of available networks
  const availableNetworksCount = networkStatus?.availableNetworks?.length || 0;

  // Function to detect if current network is in available networks
  const checkIfCurrentNetworkIsInList = () => {
    // If not online or no network status, nothing to check
    if (!isOnline || !networkStatus?.networkName) return;
    
    // Check if currently connected network is in the available networks list
    const currentNetworkInList = networkStatus.availableNetworks?.some(
      network => network.ssid === networkStatus.networkName
    );
    
    // If not in list, trigger a refresh to update the list
    if (!currentNetworkInList) {
      refreshNetworkStatus();
    }
  };

  // Check if current network is in list when component mounts or network changes
  useEffect(() => {
    checkIfCurrentNetworkIsInList();
  }, [networkStatus?.networkName, isOnline]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'Your device is online' : 'Your device is offline'}
          </span>
          {networkStatus?.networkName && (
            <span className="ml-2 text-sm font-medium">
              Connected to: <span className="text-primary">{networkStatus.networkName}</span>
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleScanNetworks}
            disabled={scanInProgress}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} className={scanInProgress ? 'animate-spin' : ''} />
            {scanInProgress ? 'Scanning...' : 'Scan Networks'}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={simulateDeviceConnect}
            className="flex items-center gap-1"
          >
            <Smartphone size={14} />
            Sim. Device Connect
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={simulateDeviceDisconnect}
            className="flex items-center gap-1"
          >
            <WifiOff size={14} />
            Sim. Device Disconnect
          </Button>
        </div>
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
    </div>
  );
};

export default WifiManager;
