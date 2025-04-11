
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AddNetworkDialog from '../components/AddNetworkDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworks } from '@/hooks/useNetworks';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';

// Import our new components
import { NetworkHeader } from '@/components/network-management/NetworkHeader';
import { NetworkOverview } from '@/components/network-management/NetworkOverview';
import { NetworkWiFi } from '@/components/network-management/NetworkWiFi';
import { NetworkDevices } from '@/components/network-management/NetworkDevices';
import { SavedNetworks } from '@/components/network-management/SavedNetworks';

const NetworkManagement = () => {
  const [activeTab, setActiveTab] = useState('networks');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { networks, loading, fetchNetworks } = useNetworks();
  const { 
    networkStatus, 
    isLoading, 
    refreshNetworkStatus,
    isLiveUpdating,
    toggleLiveUpdates,
    updateInterval,
    setRefreshRate,
    openGatewayInterface
  } = useNetworkStatus();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Handle gateway IP click
  const handleGatewayClick = () => {
    openGatewayInterface();
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info('Refreshing network status...');
    
    refreshNetworkStatus();
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-grow">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="max-w-screen-xl mx-auto p-4 md:p-6 animate-fade-in">
            <NetworkHeader 
              isLiveUpdating={isLiveUpdating}
              toggleLiveUpdates={toggleLiveUpdates}
              updateInterval={updateInterval}
              handleRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              openAddNetworkDialog={() => setIsAddDialogOpen(true)}
            />
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="wifi">WiFi Networks</TabsTrigger>
                <TabsTrigger value="devices">Connected Devices</TabsTrigger>
                <TabsTrigger value="saved">Saved Networks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <NetworkOverview 
                  networkStatus={networkStatus}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  handleRefresh={handleRefresh}
                  handleGatewayClick={handleGatewayClick}
                  updateInterval={updateInterval}
                  setRefreshRate={setRefreshRate}
                />
              </TabsContent>
              
              <TabsContent value="wifi">
                <NetworkWiFi />
              </TabsContent>
              
              <TabsContent value="devices">
                <NetworkDevices 
                  networkStatus={networkStatus} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="saved">
                <SavedNetworks 
                  networks={networks}
                  loading={loading}
                  fetchNetworks={fetchNetworks}
                  openAddNetworkDialog={() => setIsAddDialogOpen(true)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <AddNetworkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onNetworkAdded={fetchNetworks}
      />
    </div>
  );
};

export default NetworkManagement;
