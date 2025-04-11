
import React from 'react';
import { RefreshCw, Signal, Database, Shield, Wifi } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NetworkStatusCards } from '../overview/NetworkStatusCards';
import { AvailableNetworks } from '../overview/AvailableNetworks';
import { ConnectedDevices } from '../overview/ConnectedDevices';
import { DashboardCard } from '../ui/dashboard-card';
import { UpdateFrequencyControl } from './UpdateFrequencyControl';
import { NetworkStatus } from '@/hooks/network/types';

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
  return (
    <div className="space-y-4">
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

      <UpdateFrequencyControl 
        updateInterval={updateInterval} 
        setRefreshRate={setRefreshRate} 
      />
      
      <NetworkStatusCards 
        networkStatus={networkStatus} 
        isLoading={isLoading}
        handleGatewayClick={handleGatewayClick} 
      />
      
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
    </div>
  );
};
