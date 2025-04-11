
import React from 'react';
import { Info } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NetworkStatusCards } from './NetworkStatusCards';
import { DataUsageCards } from './DataUsageCards';
import { NetworkInfoTabs } from './NetworkInfoTabs';
import { NetworkDeviceTabs } from './NetworkDeviceTabs';
import { NetworkControls } from './NetworkControls';
import { NetworkStatusFooter } from './NetworkStatus';
import { ErrorState } from './ErrorState';
import './index.css';

const Overview: React.FC = () => {
  const { 
    networkStatus, 
    isLoading, 
    error, 
    refreshNetworkStatus,
    isLiveUpdating,
    toggleLiveUpdates,
    updateInterval,
    setRefreshRate 
  } = useNetworkStatus();

  // Fixed gateway IP handler to open in new tab with proper URL formatting
  const handleGatewayClick = () => {
    if (networkStatus?.gatewayIp) {
      let url = networkStatus.gatewayIp;
      // Make sure URL has proper protocol prefix
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefresh = () => {
    refreshNetworkStatus();
  };

  if (error) {
    return <ErrorState error={error} handleRefresh={handleRefresh} />;
  }

  return (
    <div className="content-card animate-fade-in">
      {/* Header section */}
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

      {/* Network status cards */}
      <NetworkStatusCards networkStatus={networkStatus} isLoading={isLoading} />

      {/* Data usage cards */}
      <DataUsageCards networkStatus={networkStatus} isLoading={isLoading} />
      
      {/* Network info and device tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <NetworkInfoTabs 
            networkStatus={networkStatus} 
            isLoading={isLoading}
            handleGatewayClick={handleGatewayClick}
          />
        </div>
        
        <div>
          <NetworkDeviceTabs networkStatus={networkStatus} isLoading={isLoading} />
        </div>
      </div>
      
      <NetworkStatusFooter networkStatus={networkStatus} isLiveUpdating={isLiveUpdating} />
    </div>
  );
};

export default Overview;
