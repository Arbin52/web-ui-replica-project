
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import NetworkList from '../components/NetworkList';
import AddNetworkDialog from '../components/AddNetworkDialog';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wifi, Signal, Database, Shield, RefreshCw } from 'lucide-react';
import { useNetworks } from '@/hooks/useNetworks';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NetworkStatusCards } from '@/components/overview/NetworkStatusCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailableNetworks } from '@/components/overview/AvailableNetworks';
import { ConnectedDevices } from '@/components/overview/ConnectedDevices';
import { DashboardCard } from '@/components/ui/dashboard-card';
import WifiManager from '@/components/wifi/WifiManager';
import { toast } from 'sonner';

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
    setRefreshRate
  } = useNetworkStatus();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Network Management</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-2">
                  <div className={`w-3 h-3 rounded-full ${isLiveUpdating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-muted-foreground">
                    {isLiveUpdating ? `Live (${updateInterval/1000}s)` : 'Live updates paused'}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleLiveUpdates}
                >
                  {isLiveUpdating ? 'Pause' : 'Resume'} Updates
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusCircle size={16} />
                  Add Network
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="wifi">WiFi Networks</TabsTrigger>
                <TabsTrigger value="devices">Connected Devices</TabsTrigger>
                <TabsTrigger value="saved">Saved Networks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DashboardCard 
                    title="Network Status"
                    value={networkStatus?.isOnline ? "Online" : "Offline"}
                    icon={<Signal size={18} />}
                    description="Current connection status"
                    isLoading={isLoading}
                    className={networkStatus?.isOnline ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}
                  />
                  <DashboardCard 
                    title="Download Speed"
                    value={`${networkStatus?.connectionSpeed.download || 0} Mbps`}
                    icon={<Database size={18} />}
                    description="Current download speed"
                    isLoading={isLoading}
                  />
                  <DashboardCard 
                    title="Upload Speed"
                    value={`${networkStatus?.connectionSpeed.upload || 0} Mbps`}
                    icon={<Database size={18} />}
                    description="Current upload speed"
                    isLoading={isLoading}
                  />
                  <DashboardCard 
                    title="Network Security"
                    value={networkStatus?.availableNetworks?.find(n => n.ssid === networkStatus.networkName)?.security || "N/A"}
                    icon={<Shield size={18} />}
                    description="Security protocol"
                    isLoading={isLoading}
                  />
                </div>

                <div className="bg-muted/50 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Update Frequency</h3>
                    <p className="text-sm text-muted-foreground">Adjust how often network data is refreshed</p>
                  </div>
                  <div className="flex gap-2">
                    {[2000, 5000, 10000].map(interval => (
                      <Button 
                        key={interval} 
                        size="sm"
                        variant={updateInterval === interval ? "default" : "outline"}
                        onClick={() => setRefreshRate(interval)}
                      >
                        {interval / 1000}s
                      </Button>
                    ))}
                  </div>
                </div>
                
                <NetworkStatusCards networkStatus={networkStatus} isLoading={isLoading} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AvailableNetworks networkStatus={networkStatus} isLoading={isLoading} />
                  <ConnectedDevices networkStatus={networkStatus} isLoading={isLoading} />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="w-full mt-2"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refresh Network Data
                </Button>
              </TabsContent>
              
              <TabsContent value="wifi">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi size={18} />
                      WiFi Management
                    </CardTitle>
                    <CardDescription>
                      View and manage WiFi networks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WifiManager />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="devices">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Devices</CardTitle>
                    <CardDescription>
                      Manage devices connected to your network
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ConnectedDevices networkStatus={networkStatus} isLoading={isLoading} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Networks</CardTitle>
                    <CardDescription>
                      Your saved network configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white rounded-lg p-6">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : networks.length > 0 ? (
                        <NetworkList networks={networks} onRefresh={fetchNetworks} />
                      ) : (
                        <div className="text-center py-10">
                          <h3 className="text-lg font-medium text-gray-600 mb-2">No Networks Found</h3>
                          <p className="text-gray-500 mb-4">You haven't added any networks yet.</p>
                          <Button 
                            onClick={() => setIsAddDialogOpen(true)}
                            variant="outline"
                            className="flex items-center gap-2 mx-auto"
                          >
                            <PlusCircle size={16} />
                            Add Your First Network
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
