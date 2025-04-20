
import React from 'react';
import { Globe, Activity, Clock } from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { NetworkStatus } from '@/hooks/network/types';

interface NetworkStatusCardsProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  handleGatewayClick?: () => void;
}

export const NetworkStatusCards: React.FC<NetworkStatusCardsProps> = ({ networkStatus, isLoading, handleGatewayClick }) => {
  // Use browser's online status as fallback
  const isOnline = networkStatus?.isOnline ?? navigator.onLine;
  
  // Handle null or undefined values gracefully
  const downloadSpeed = networkStatus?.connectionSpeed?.download || 0;
  const uploadSpeed = networkStatus?.connectionSpeed?.upload || 0;
  const latency = networkStatus?.connectionSpeed?.latency || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardCard
        title="Network Status"
        value={isLoading ? "Loading..." : isOnline ? "Online" : "Offline"}
        icon={<Globe className="h-5 w-5" />}
        change={{
          value: 100,
          trend: "up"
        }}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Download Speed"
        value={isLoading ? "Loading..." : `${downloadSpeed} Mbps`}
        icon={<Activity className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Upload Speed"
        value={isLoading ? "Loading..." : `${uploadSpeed} Mbps`}
        icon={<Activity className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Latency"
        value={isLoading ? "Loading..." : `${latency} ms`}
        icon={<Clock className="h-5 w-5" />}
        description="Current ping time"
        isLoading={isLoading}
      />
    </div>
  );
};
