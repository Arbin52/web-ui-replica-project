
import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NetworkStatusCards } from './NetworkStatusCards';
import { DataUsageCards } from './DataUsageCards';
import { NetworkStatusFooter } from './NetworkStatus';
import { ErrorState } from './ErrorState';
import { PageHeader } from './PageHeader';
import { FeatureCards } from './FeatureCards';
import { NetworkTabSection } from './NetworkTabSection';
import NetworkStatusMonitor from './NetworkStatusMonitor';
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
    setRefreshRate,
    openGatewayInterface 
  } = useNetworkStatus();

  // Always use the modal gateway handler
  const handleGatewayClick = () => {
    if (networkStatus?.gatewayIp) {
      openGatewayInterface();
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
      <PageHeader 
        isLoading={isLoading}
        isLiveUpdating={isLiveUpdating}
        updateInterval={updateInterval}
        toggleLiveUpdates={toggleLiveUpdates}
        setRefreshRate={setRefreshRate}
        handleRefresh={handleRefresh}
      />

      {/* Network status cards */}
      <NetworkStatusCards networkStatus={networkStatus} isLoading={isLoading} />

      {/* Real-time Network Status Monitor */}
      <div className="mb-6">
        <NetworkStatusMonitor 
          networkStatus={networkStatus}
          isLoading={isLoading}
          isLiveUpdating={isLiveUpdating}
          toggleLiveUpdates={toggleLiveUpdates}
          refreshNetworkStatus={refreshNetworkStatus}
          updateInterval={updateInterval}
        />
      </div>

      {/* Data usage cards */}
      <DataUsageCards networkStatus={networkStatus} isLoading={isLoading} />
      
      {/* Feature overview grid */}
      <FeatureCards networkStatus={networkStatus} isLoading={isLoading} />
      
      {/* Network info and device tabs */}
      <NetworkTabSection 
        networkStatus={networkStatus} 
        isLoading={isLoading}
        handleGatewayClick={handleGatewayClick}
      />
      
      <NetworkStatusFooter networkStatus={networkStatus} isLiveUpdating={isLiveUpdating} />
    </div>
  );
};

export default Overview;
