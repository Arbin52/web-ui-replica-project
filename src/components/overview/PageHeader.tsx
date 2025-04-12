
import React from 'react';
import { Info, Wifi } from 'lucide-react';
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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Wifi size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Network Overview</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage your network connections</p>
        </div>
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
