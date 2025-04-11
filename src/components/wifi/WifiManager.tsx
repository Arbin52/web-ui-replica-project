
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from 'lucide-react';
import { useWifiManager } from '@/hooks/network/useWifiManager';
import '../overview/index.css';

// Import our components
import CurrentConnection from './components/CurrentConnection';
import AvailableNetworks from './components/AvailableNetworks';
import NetworkDiagnostics from './components/NetworkDiagnostics';
import NetworkHistory from './components/NetworkHistory';
import PasswordDialog from './components/PasswordDialog';
import StatusBar from './components/StatusBar';
import DeviceSimulation from './components/DeviceSimulation';
import NetworkNameDialog from './components/NetworkNameDialog';
import NetworkActionBar from './components/NetworkActionBar';

const WifiManager: React.FC = () => {
  const {
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
    handleSubmitPassword,
    handleEditNetworkName,
    handleSaveNetworkName,
    refreshNetworkStatus,
    getSignalStrength,
    simulateDeviceConnect,
    simulateDeviceDisconnect
  } = useWifiManager();

  return (
    <div className="space-y-6">
      <StatusBar 
        isOnline={isOnline}
        detectedNetworkName={detectedNetworkName}
        shouldPromptForNetworkName={shouldPromptForNetworkName}
        handleEditNetworkName={handleEditNetworkName}
      />
      
      <NetworkActionBar 
        handleScanNetworks={handleScanNetworks}
        scanInProgress={scanInProgress}
        simulateDeviceConnect={simulateDeviceConnect}
        simulateDeviceDisconnect={simulateDeviceDisconnect}
      />

      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Connection</TabsTrigger>
          <TabsTrigger value="available">Available Networks ({availableNetworksCount})</TabsTrigger>
          <TabsTrigger value="history">Connection History</TabsTrigger>
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
        
        <TabsContent value="history" className="space-y-4">
          <NetworkHistory onRefresh={refreshNetworkStatus} />
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
