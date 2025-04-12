
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectedDevices } from './ConnectedDevices';
import { AvailableNetworks } from './AvailableNetworks';
import { NetworkStatus } from '@/hooks/network/types';
import { Wifi, Router } from 'lucide-react';

interface NetworkDeviceTabsProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const NetworkDeviceTabs: React.FC<NetworkDeviceTabsProps> = ({ 
  networkStatus, 
  isLoading 
}) => {
  const [activeNetworkTab, setActiveNetworkTab] = useState('connected');
  const connectedCount = networkStatus?.connectedDevices?.length || 0;
  const availableCount = networkStatus?.availableNetworks?.length || 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <Tabs value={activeNetworkTab} onValueChange={setActiveNetworkTab} className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-2">
          <TabsTrigger value="connected" className="flex items-center gap-2">
            <Router size={16} />
            <span>Connected Devices</span>
            <span className="ml-1 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{isLoading ? '...' : connectedCount}</span>
          </TabsTrigger>
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Wifi size={16} />
            <span>Available Networks</span>
            <span className="ml-1 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{isLoading ? '...' : availableCount}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connected" className="mt-0 animate-fade-in">
          <ConnectedDevices networkStatus={networkStatus} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="available" className="mt-0 animate-fade-in">
          <AvailableNetworks networkStatus={networkStatus} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
