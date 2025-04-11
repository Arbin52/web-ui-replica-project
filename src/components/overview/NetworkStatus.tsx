
import React from 'react';
import { Wifi, PauseCircle } from 'lucide-react';
import { NetworkStatus as NetworkStatusType } from '@/hooks/network/types';

interface NetworkStatusFooterProps {
  networkStatus: NetworkStatusType | null;
  isLiveUpdating: boolean;
}

export const NetworkStatusFooter: React.FC<NetworkStatusFooterProps> = ({ networkStatus, isLiveUpdating }) => {
  if (!networkStatus) return null;
  
  return (
    <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
      <Wifi size={12} />
      <span>Last updated: {networkStatus.lastUpdated.toLocaleTimeString()}</span>
      {!isLiveUpdating && (
        <span className="ml-2 text-amber-500 flex items-center gap-1">
          <PauseCircle size={12} />
          Live updates paused
        </span>
      )}
    </div>
  );
};
