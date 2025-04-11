
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import NetworkList from '../components/NetworkList';
import AddNetworkDialog from '../components/AddNetworkDialog';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wifi, Signal, Database, Shield } from 'lucide-react';
import { useNetworks } from '@/hooks/useNetworks';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NetworkStatusCards } from '@/components/overview/NetworkStatusCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailableNetworks } from '@/components/overview/AvailableNetworks';
import { ConnectedDevices } from '@/components/overview/ConnectedDevices';
import { DashboardCard } from '@/components/ui/dashboard-card';
import WifiManager from '@/components/wifi/WifiManager';

const NetworkManagement = () => {
  const [activeTab, setActiveTab] = useState('networks');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { networks, loading, fetchNetworks } = useNetworks();
  const { networkStatus, isLoading, refreshNetworkStatus } = useNetworkStatus();
  
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
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Network
              </Button>
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
                
                <NetworkStatusCards networkStatus={networkStatus} isLoading={isLoading} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AvailableNetworks networkStatus={networkStatus} isLoading={isLoading} />
                  <ConnectedDevices networkStatus={networkStatus} isLoading={isLoading} />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={refreshNetworkStatus}
                  className="w-full mt-2"
                >
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
