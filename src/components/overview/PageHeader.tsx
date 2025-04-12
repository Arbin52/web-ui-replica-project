
import React from 'react';
import { Info } from 'lucide-react';
import { NetworkControls } from './NetworkControls';

interface PageHeaderProps {
  isLoading: boolean;
  isLiveUpdating: boolean;
  updateInterval: number;
  toggleLiveUpdates: () => void;
  setRefreshRate: (ms: number) => void;
  handleRefresh: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  isLoading,
  isLiveUpdating,
  updateInterval,
  toggleLiveUpdates,
  setRefreshRate,
  handleRefresh
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Info size={24} />
        <h2 className="text-xl font-bold">Network Overview</h2>
      </div>
      <NetworkControls
        isLoading={isLoading}
        isLiveUpdating={isLiveUpdating}
        updateInterval={updateInterval}
        toggleLiveUpdates={toggleLiveUpdates}
        setRefreshRate={setRefreshRate}
        handleRefresh={handleRefresh}
      />
    </div>
  );
};
