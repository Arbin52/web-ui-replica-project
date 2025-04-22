
import React, { useState } from 'react';
import { NetworkStatusSection } from './sections/NetworkStatusSection';
import { NetworkDeviceTabs } from '../overview/NetworkDeviceTabs';
import { UpdateFrequencyControl } from './UpdateFrequencyControl';
import { NetworkStatusCards } from '../overview/NetworkStatusCards';
import { NetworkStatus } from '@/hooks/network/types';
import { NetworkRefreshButton } from './overview/NetworkRefreshButton';
import { RouterDialog } from './overview/RouterDialog';

interface NetworkOverviewProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleGatewayClick: () => void;
  updateInterval: number;
  setRefreshRate: (interval: number) => void;
}

export const NetworkOverview: React.FC<NetworkOverviewProps> = ({
  networkStatus,
  isLoading,
  isRefreshing,
  handleRefresh,
  handleGatewayClick,
  updateInterval,
  setRefreshRate
}) => {
  const [isMockRouterOpen, setIsMockRouterOpen] = useState(false);

  const handleGatewayClickLocal = () => {
    setIsMockRouterOpen(true);
  };

  return (
    <div className="space-y-6">
      <NetworkStatusSection 
        networkStatus={networkStatus}
        isLoading={isLoading}
        handleGatewayClick={handleGatewayClickLocal}
      />

      <NetworkDeviceTabs 
        networkStatus={networkStatus} 
        isLoading={isLoading} 
      />
      
      <UpdateFrequencyControl 
        updateInterval={updateInterval} 
        setRefreshRate={setRefreshRate} 
      />
      
      <NetworkStatusCards 
        networkStatus={networkStatus} 
        isLoading={isLoading}
        handleGatewayClick={handleGatewayClickLocal} 
      />
      
      <NetworkRefreshButton 
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
      />
      
      <RouterDialog
        isOpen={isMockRouterOpen}
        onClose={() => setIsMockRouterOpen(false)}
        gatewayIp={networkStatus?.gatewayIp || '192.168.1.1'}
      />
    </div>
  );
};
