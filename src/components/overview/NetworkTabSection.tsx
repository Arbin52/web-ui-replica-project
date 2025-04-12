
import React from 'react';
import { NetworkInfoTabs } from './NetworkInfoTabs';
import { NetworkDeviceTabs } from './NetworkDeviceTabs';
import { NetworkStatus } from '@/hooks/network/types';

interface NetworkTabSectionProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  handleGatewayClick: () => void;
}

export const NetworkTabSection: React.FC<NetworkTabSectionProps> = ({ 
  networkStatus, 
  isLoading,
  handleGatewayClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <NetworkInfoTabs 
          networkStatus={networkStatus} 
          isLoading={isLoading}
          handleGatewayClick={handleGatewayClick}
        />
      </div>
      
      <div>
        <NetworkDeviceTabs networkStatus={networkStatus} isLoading={isLoading} />
      </div>
    </div>
  );
};
