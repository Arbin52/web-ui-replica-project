
import React, { useMemo, useCallback, Suspense, lazy } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NetworkStatusCards } from './NetworkStatusCards';
import { DataUsageCards } from './DataUsageCards';
import { NetworkStatusFooter } from './NetworkStatus';
import { ErrorState } from './ErrorState';
import { PageHeader } from './PageHeader';
import { NetworkTabSection } from './NetworkTabSection';
import NetworkStatusMonitor from './NetworkStatusMonitor';
import './index.css';

// Lazy load feature cards to improve initial render speed
const FeatureCards = lazy(() => import('./FeatureCards'));

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

  // Memoize the gateway handler to prevent re-renders
  const handleGatewayClick = useCallback(() => {
    if (networkStatus?.gatewayIp) {
      openGatewayInterface();
    }
  }, [networkStatus?.gatewayIp, openGatewayInterface]);

  // Optimize the refresh handler with debouncing
  const handleRefresh = useCallback(() => {
    // Use requestIdleCallback if available, otherwise use setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => refreshNetworkStatus(), { timeout: 2000 });
    } else {
      setTimeout(() => refreshNetworkStatus(), 0);
    }
  }, [refreshNetworkStatus]);

  // Use error boundary pattern
  if (error) {
    return <ErrorState error={error} handleRefresh={handleRefresh} />;
  }

  // Memoize content sections to prevent unnecessary re-renders
  const headerSection = useMemo(() => (
    <PageHeader 
      isLoading={isLoading}
      isLiveUpdating={isLiveUpdating}
      updateInterval={updateInterval}
      toggleLiveUpdates={toggleLiveUpdates}
      setRefreshRate={setRefreshRate}
      handleRefresh={handleRefresh}
    />
  ), [isLoading, isLiveUpdating, updateInterval, toggleLiveUpdates, setRefreshRate, handleRefresh]);

  const statusCardsSection = useMemo(() => (
    <NetworkStatusCards networkStatus={networkStatus} isLoading={isLoading} />
  ), [networkStatus, isLoading]);

  const monitorSection = useMemo(() => (
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
  ), [networkStatus, isLoading, isLiveUpdating, toggleLiveUpdates, refreshNetworkStatus, updateInterval]);

  const dataUsageSection = useMemo(() => (
    <DataUsageCards networkStatus={networkStatus} isLoading={isLoading} />
  ), [networkStatus, isLoading]);

  const tabsSection = useMemo(() => (
    <NetworkTabSection 
      networkStatus={networkStatus} 
      isLoading={isLoading}
      handleGatewayClick={handleGatewayClick}
    />
  ), [networkStatus, isLoading, handleGatewayClick]);

  const footerSection = useMemo(() => (
    <NetworkStatusFooter networkStatus={networkStatus} isLiveUpdating={isLiveUpdating} />
  ), [networkStatus, isLiveUpdating]);

  return (
    <div className="content-card animate-fade-in">
      {headerSection}
      {statusCardsSection}
      {monitorSection}
      {dataUsageSection}
      
      {/* Wrap FeatureCards in Suspense to prevent render blocking */}
      <Suspense fallback={<div className="h-48 bg-gray-50 rounded animate-pulse"></div>}>
        <FeatureCards networkStatus={networkStatus} isLoading={isLoading} />
      </Suspense>
      
      {tabsSection}
      {footerSection}
    </div>
  );
};

export default Overview;
