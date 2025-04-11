
import React from 'react';
import { Globe, Activity, Clock } from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';

interface NetworkStatusCardsProps {
  networkStatus: any;
  isLoading: boolean;
}

export const NetworkStatusCards: React.FC<NetworkStatusCardsProps> = ({ networkStatus, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardCard
        title="Network Status"
        value={isLoading ? "" : networkStatus?.isOnline ? "Online" : "Offline"}
        icon={<Globe className="h-5 w-5" />}
        change={{
          value: 100,
          trend: "up"
        }}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Download Speed"
        value={isLoading ? "" : `${networkStatus?.connectionSpeed.download} Mbps`}
        icon={<Activity className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Upload Speed"
        value={isLoading ? "" : `${networkStatus?.connectionSpeed.upload} Mbps`}
        icon={<Activity className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Latency"
        value={isLoading ? "" : `${networkStatus?.connectionSpeed.latency} ms`}
        icon={<Clock className="h-5 w-5" />}
        description="Current ping time"
        isLoading={isLoading}
      />
    </div>
  );
};
