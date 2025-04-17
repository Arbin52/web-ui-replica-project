
import React, { memo } from 'react';
import { Network } from 'lucide-react';
import OptimizedFeatureCard from '../OptimizedFeatureCard';

interface NetworkManagementCardProps {
  deviceCount: number;
  isOnline: boolean | undefined;
}

const NetworkManagementCard: React.FC<NetworkManagementCardProps> = ({ deviceCount, isOnline }) => {
  // Use navigator.onLine as a backup if isOnline is undefined
  const networkStatus = isOnline !== undefined ? isOnline : navigator.onLine;
  
  return (
    <OptimizedFeatureCard
      icon={<Network size={18} className="text-indigo-500" />}
      title="Network Management"
      description="Devices & settings"
      path="/networks"
      buttonText="Manage Network"
      priority="high" // High priority since this is the main feature
    >
      <div className="flex justify-between mb-2">
        <div className="text-sm">
          <p className="text-muted-foreground">Connected devices</p>
          <p className="font-semibold">{deviceCount}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Network status</p>
          <p className={`font-semibold ${networkStatus ? 'text-green-500' : 'text-red-500'}`}>
            {networkStatus ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    </OptimizedFeatureCard>
  );
};

export default memo(NetworkManagementCard);
