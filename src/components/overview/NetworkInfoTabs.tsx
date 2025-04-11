
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicNetworkInfo } from './BasicNetworkInfo';
import { AdvancedNetworkInfo } from './AdvancedNetworkInfo';
import { NetworkStatus } from '@/hooks/network/types';
import { toast } from 'sonner';

interface NetworkInfoTabsProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  handleGatewayClick: () => void;
}

export const NetworkInfoTabs: React.FC<NetworkInfoTabsProps> = ({ 
  networkStatus, 
  isLoading, 
  handleGatewayClick 
}) => {
  const [activeInfoTab, setActiveInfoTab] = useState('basic');

  return (
    <Tabs value={activeInfoTab} onValueChange={setActiveInfoTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="advanced">Advanced Details</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="animate-fade-in">
        <BasicNetworkInfo 
          networkStatus={networkStatus} 
          isLoading={isLoading}
          handleGatewayClick={handleGatewayClick}
        />
      </TabsContent>
      
      <TabsContent value="advanced" className="animate-fade-in">
        <AdvancedNetworkInfo 
          networkStatus={networkStatus} 
          isLoading={isLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};
