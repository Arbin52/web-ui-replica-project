
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { Smartphone, WifiOff, RefreshCw, Loader2, Edit2 } from 'lucide-react';
import '../overview/index.css';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    clearConnectionError,
    checkCurrentNetworkImmediately
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

  // Initial detection of network status
  useEffect(() => {
    const doInitialCheck = async () => {
      console.log("Doing initial network check");
      await refreshNetworkStatus();
      detectRealNetworkName();
    };
    
    doInitialCheck();
    
    // Check network status very frequently for real-time updates
    const fastUpdateInterval = setInterval(() => {
      checkCurrentNetworkImmediately();
      detectRealNetworkName();
    }, 1000);
    
    return () => clearInterval(fastUpdateInterval);
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
    toast.info("Scanning for WiFi networks...");
    
    await refreshNetworkStatus();
    
    // Check browser's network status after a short delay
    setTimeout(async () => {
      console.log("Checking network status after scan");
      await checkCurrentNetworkImmediately();
      setScanInProgress(false);
      toast.success("Network scan complete");
    }, 1500);
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
      setDetectedNetworkName(null);
    } catch (error) {
      console.error("Disconnection error:", error);
      toast.error("Failed to disconnect from network");
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
      toast.success(`Network name set to ${customNetworkName.trim()}`);
      refreshNetworkStatus();
    }
    setShowNetworkNameDialog(false);
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
      console.log("Current network not in available list, refreshing");
      refreshNetworkStatus();
    }
  };

  // Check if current network is in list when component mounts or network changes
  useEffect(() => {
    checkIfCurrentNetworkIsInList();
  }, [networkStatus?.networkName, isOnline]);

  // Calculate if we need to prompt for network name
  const shouldPromptForNetworkName = isOnline && 
                                     (!detectedNetworkName || 
                                      detectedNetworkName === "Unknown Network" || 
                                      detectedNetworkName === "Connected Network");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'Your device is online' : 'Your device is offline'}
          </span>
          
          {/* Always show network name section if online, with edit button */}
          {isOnline && (
            <div className="ml-2 text-sm font-medium flex items-center">
              Connected to: 
              <span className={`ml-1 ${shouldPromptForNetworkName ? 'text-amber-500' : 'text-primary'}`}>
                {shouldPromptForNetworkName ? 'Unknown Network' : detectedNetworkName}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-1" 
                onClick={handleEditNetworkName} 
                title="Edit network name"
              >
                <Edit2 size={12} />
              </Button>
              
              {/* Show prompt button if we can't detect the network name */}
              {shouldPromptForNetworkName && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs ml-2 h-6"
                  onClick={handleEditNetworkName}
                >
                  Set Network Name
                </Button>
              )}
            </div>
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
            {scanInProgress ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
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

      {/* Network Name Dialog */}
      <Dialog open={showNetworkNameDialog} onOpenChange={setShowNetworkNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Network Name</DialogTitle>
            <DialogDescription>
              Enter the actual name of the network you're connected to
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="networkName">Network Name</Label>
              <Input 
                id="networkName" 
                type="text" 
                placeholder="Enter network name" 
                value={customNetworkName}
                onChange={(e) => setCustomNetworkName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNetworkNameDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNetworkName}
              disabled={!customNetworkName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WifiManager;
