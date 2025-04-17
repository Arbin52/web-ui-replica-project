
import React, { memo } from 'react';
import { Network } from 'lucide-react';
import OptimizedFeatureCard from '../OptimizedFeatureCard';

interface NetworkManagementCardProps {
  deviceCount: number;
  isOnline: boolean | undefined;
}

const NetworkManagementCard: React.FC<NetworkManagementCardProps> = ({ deviceCount, isOnline }) => {
  return (
    <OptimizedFeatureCard
      icon={<Network size={18} className="text-indigo-500" />}
      title="Network Management"
      description="Devices & settings"
      path="/networks"
      buttonText="Manage Network"
    >
      <div className="flex justify-between mb-2">
        <div className="text-sm">
          <p className="text-muted-foreground">Connected devices</p>
          <p className="font-semibold">{deviceCount}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Network status</p>
          <p className={`font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    </OptimizedFeatureCard>
  );
};

export default memo(NetworkManagementCard);
