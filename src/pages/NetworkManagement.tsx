
import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AddNetworkDialog from '../components/AddNetworkDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworks } from '@/hooks/useNetworks';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';

// Import our optimized components
import { NetworkHeader } from '@/components/network-management/NetworkHeader';
import NetworkOverviewOptimized from '@/components/network-management/NetworkOverviewOptimized';
import { NetworkStatistics } from '@/components/network-management/NetworkStatistics';
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
  
  // Memoize handlers to prevent re-renders
  const handleGatewayClick = useCallback(() => {
    openGatewayInterface();
  }, [openGatewayInterface]);
  
  // Optimize the refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    toast.info('Refreshing network status...');
    
    refreshNetworkStatus();
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [refreshNetworkStatus]);

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
                <TabsTrigger value="statistics">Network Statistics</TabsTrigger>
                <TabsTrigger value="devices">Connected Devices</TabsTrigger>
                <TabsTrigger value="saved">Saved Networks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <NetworkOverviewOptimized 
                  networkStatus={networkStatus}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  handleRefresh={handleRefresh}
                  handleGatewayClick={handleGatewayClick}
                  updateInterval={updateInterval}
                  setRefreshRate={setRefreshRate}
                />
              </TabsContent>
              
              <TabsContent value="statistics">
                <NetworkStatistics 
                  networkStatus={networkStatus}
                  isLoading={isLoading}
                />
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
