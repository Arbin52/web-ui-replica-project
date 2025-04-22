
import React, { useState } from 'react';
import { NetworkStatusSection } from './sections/NetworkStatusSection';
import { NetworkDeviceTabs } from '../overview/NetworkDeviceTabs';
import { UpdateFrequencyControl } from './UpdateFrequencyControl';
import { NetworkStatusCards } from '../overview/NetworkStatusCards';
import { NetworkStatus } from '@/hooks/network/types';
import { Button } from "@/components/ui/button";
import { Signal } from 'lucide-react';
import MockRouterAdmin from './MockRouterAdmin';

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
      
      <Button 
        variant="outline" 
        onClick={handleRefresh}
        className="w-full mt-2 hover:bg-primary/5"
        disabled={isRefreshing}
      >
        <div className="flex items-center">
          <Signal className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Network Data'}
        </div>
      </Button>
      
      {isMockRouterOpen && (
        <MockRouterAdmin
          open={isMockRouterOpen}
          onClose={() => setIsMockRouterOpen(false)}
          gatewayIp={networkStatus?.gatewayIp || '192.168.1.1'}
          isRealNetwork={false}
        />
      )}
    </div>
  );
};
