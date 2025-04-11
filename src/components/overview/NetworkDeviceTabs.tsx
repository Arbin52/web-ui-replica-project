
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectedDevices } from './ConnectedDevices';
import { AvailableNetworks } from './AvailableNetworks';
import { NetworkStatus } from '@/hooks/network/types';

interface NetworkDeviceTabsProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const NetworkDeviceTabs: React.FC<NetworkDeviceTabsProps> = ({ 
  networkStatus, 
  isLoading 
}) => {
  const [activeNetworkTab, setActiveNetworkTab] = useState('connected');

  return (
    <Tabs value={activeNetworkTab} onValueChange={setActiveNetworkTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="connected">Connected Devices</TabsTrigger>
        <TabsTrigger value="available">Available Networks</TabsTrigger>
      </TabsList>
      
      <TabsContent value="connected">
        <ConnectedDevices networkStatus={networkStatus} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="available">
        <AvailableNetworks networkStatus={networkStatus} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};
