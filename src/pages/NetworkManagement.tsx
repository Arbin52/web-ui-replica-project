
import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworks } from '@/hooks/useNetworks';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';
import { debounce } from '@/utils/performance';

// Import our header component (not lazy loaded since it's small and always visible)
import { NetworkHeader } from '@/components/network-management/NetworkHeader';

// Lazy load larger components to improve initial page load
const AddNetworkDialog = lazy(() => import('../components/AddNetworkDialog'));
const NetworkOverviewOptimized = lazy(() => 
  import('@/components/network-management/NetworkOverviewOptimized'));
const NetworkStatistics = lazy(() => 
  import('@/components/network-management/NetworkStatistics').then(module => ({ default: module.NetworkStatistics })));
const NetworkDevices = lazy(() => 
  import('@/components/network-management/NetworkDevices').then(module => ({ default: module.NetworkDevices })));
const SavedNetworks = lazy(() => 
  import('@/components/network-management/SavedNetworks').then(module => ({ default: module.SavedNetworks })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full p-4 bg-gray-50 rounded-md animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

const NetworkManagement = () => {
  const [activeTab, setActiveTab] = useState('networks');
  const [tabValue, setTabValue] = useState('overview');
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
  
  // Debounced refresh handler to prevent multiple rapid refreshes
  const debouncedRefresh = useCallback(
    debounce(() => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        toast.info('Refreshing network status...');
        
        refreshNetworkStatus()
          .finally(() => {
            // Use setTimeout to ensure a minimum visual feedback time
            setTimeout(() => {
              setIsRefreshing(false);
            }, 500);
          });
      }
    }, 500),
    [refreshNetworkStatus, isRefreshing]
  );
  
  // Handle opening the add network dialog with debounce to prevent double-clicks
  const handleOpenAddDialog = useCallback(
    debounce(() => {
      setIsAddDialogOpen(true);
    }, 300),
    []
  );
  
  // Use memo to prevent tab content re-rendering unless necessary
  const tabContent = useMemo(() => (
    <Tabs 
      value={tabValue} 
      onValueChange={setTabValue}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="statistics">Network Statistics</TabsTrigger>
        <TabsTrigger value="devices">Connected Devices</TabsTrigger>
        <TabsTrigger value="saved">Saved Networks</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <Suspense fallback={<LoadingFallback />}>
          <NetworkOverviewOptimized 
            networkStatus={networkStatus}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            handleRefresh={debouncedRefresh}
            handleGatewayClick={handleGatewayClick}
            updateInterval={updateInterval}
            setRefreshRate={setRefreshRate}
          />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="statistics">
        <Suspense fallback={<LoadingFallback />}>
          <NetworkStatistics 
            networkStatus={networkStatus}
            isLoading={isLoading}
          />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="devices">
        <Suspense fallback={<LoadingFallback />}>
          <NetworkDevices 
            networkStatus={networkStatus} 
            isLoading={isLoading} 
          />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="saved">
        <Suspense fallback={<LoadingFallback />}>
          <SavedNetworks 
            networks={networks}
            loading={loading}
            fetchNetworks={fetchNetworks}
            openAddNetworkDialog={handleOpenAddDialog}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  ), [
    tabValue,
    networkStatus,
    isLoading,
    isRefreshing,
    networks,
    loading,
    debouncedRefresh,
    handleGatewayClick,
    updateInterval,
    setRefreshRate,
    fetchNetworks,
    handleOpenAddDialog
  ]);

  // Memoize the header to prevent re-renders
  const networkHeader = useMemo(() => (
    <NetworkHeader 
      isLiveUpdating={isLiveUpdating}
      toggleLiveUpdates={toggleLiveUpdates}
      updateInterval={updateInterval}
      handleRefresh={debouncedRefresh}
      isRefreshing={isRefreshing}
      openAddNetworkDialog={handleOpenAddDialog}
    />
  ), [
    isLiveUpdating,
    toggleLiveUpdates,
    updateInterval,
    debouncedRefresh,
    isRefreshing,
    handleOpenAddDialog
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-grow">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="max-w-screen-xl mx-auto p-4 md:p-6 animate-fade-in">
            {networkHeader}
            {tabContent}
          </div>
        </div>
      </div>
      
      {/* Load dialog only when needed */}
      {isAddDialogOpen && (
        <Suspense fallback={null}>
          <AddNetworkDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onNetworkAdded={fetchNetworks}
          />
        </Suspense>
      )}
    </div>
  );
};

export default NetworkManagement;
