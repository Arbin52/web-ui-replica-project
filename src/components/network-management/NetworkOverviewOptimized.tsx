
import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { Signal, Database, Shield, Wifi, Router } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NetworkStatusCards } from '../overview/NetworkStatusCards';
import { NetworkDeviceTabs } from '../overview/NetworkDeviceTabs';
import { DashboardCard } from '../ui/dashboard-card';
import { UpdateFrequencyControl } from './UpdateFrequencyControl';
import { NetworkStatus } from '@/hooks/network/types';
import { Card, CardContent } from '@/components/ui/card';
import MockRouterAdmin from './MockRouterAdmin';
import { throttle } from '@/utils/performance';

interface NetworkOverviewProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleGatewayClick: () => void;
  updateInterval: number;
  setRefreshRate: (interval: number) => void;
}

// Memoized status card to prevent unnecessary re-renders
const StatusCard = memo(({ 
  title, 
  value, 
  icon, 
  description, 
  isLoading, 
  className 
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  isLoading: boolean;
  className?: string;
}) => (
  <DashboardCard 
    title={title}
    value={String(value)}
    icon={icon}
    description={description}
    isLoading={isLoading}
    className={className}
  />
));

// The main component with performance optimizations
const NetworkOverviewOptimized: React.FC<NetworkOverviewProps> = ({
  networkStatus,
  isLoading,
  isRefreshing,
  handleRefresh,
  handleGatewayClick,
  updateInterval,
  setRefreshRate
}) => {
  // Use simple state without animations to improve performance
  const [isMockRouterOpen, setIsMockRouterOpen] = useState(false);
  
  // Static display values to prevent continuous updates
  const displayDownload = useMemo(() => {
    if (!networkStatus?.connectionSpeed.download) return 0;
    return parseFloat(networkStatus.connectionSpeed.download.toFixed(1));
  }, [networkStatus?.connectionSpeed.download]);
  
  const displayUpload = useMemo(() => {
    if (!networkStatus?.connectionSpeed.upload) return 0;
    return parseFloat(networkStatus.connectionSpeed.upload.toFixed(1));
  }, [networkStatus?.connectionSpeed.upload]);
  
  // Throttle gateway click to prevent double clicks
  const handleGatewayClickLocal = useCallback(throttle(() => {
    setIsMockRouterOpen(true);
  }, 500), []);

  // Throttled refresh handler to prevent spam clicks
  const throttledRefresh = useCallback(throttle(() => {
    handleRefresh();
  }, 1000), [handleRefresh]);

  // Use memoization for the UI sections to prevent unnecessary re-renders
  const statusCardSection = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <StatusCard 
        title="Network Status"
        value={navigator.onLine ? "Online" : "Offline"}
        icon={<Signal size={18} />}
        description="Current connection status"
        isLoading={isLoading}
        className={`${navigator.onLine ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
      />
      <StatusCard 
        title="Download"
        value={`${displayDownload} Mbps`}
        icon={<Database size={18} />}
        description="Current download speed"
        isLoading={isLoading}
      />
      <StatusCard 
        title="Upload"
        value={`${displayUpload} Mbps`}
        icon={<Database size={18} />}
        description="Current upload speed"
        isLoading={isLoading}
      />
      <StatusCard 
        title="Security"
        value={networkStatus?.availableNetworks?.find(n => n.ssid === networkStatus.networkName)?.security || "N/A"}
        icon={<Shield size={18} />}
        description="Security protocol"
        isLoading={isLoading}
      />
    </div>
  ), [displayDownload, displayUpload, networkStatus?.availableNetworks, networkStatus?.networkName, isLoading]);

  // Optimize content based on visibility
  const [isTabsVisible, setIsTabsVisible] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Use IntersectionObserver to only render visible content
  useEffect(() => {
    if (!tabsRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTabsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(tabsRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${navigator.onLine ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <Wifi size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  {navigator.onLine ? (networkStatus?.networkName || "Connected Network") : "Not Connected"}
                </h2>
                <p className="text-muted-foreground">
                  {navigator.onLine ? 
                    `Connected via ${networkStatus?.networkType || 'WiFi'}` : 
                    "No active connection"}
                </p>
              </div>
            </div>
            {navigator.onLine && (
              <Button variant="outline" className="gap-1" onClick={handleGatewayClickLocal}>
                <Router size={16} />
                <span>Gateway: {networkStatus?.gatewayIp || '192.168.1.1'}</span>
              </Button>
            )}
          </div>

          {statusCardSection}
        </CardContent>
      </Card>

      {/* Only render tabs when necessary */}
      <div ref={tabsRef}>
        {isTabsVisible && networkStatus && (
          <NetworkDeviceTabs 
            networkStatus={networkStatus} 
            isLoading={isLoading} 
          />
        )}
      </div>
      
      <UpdateFrequencyControl 
        updateInterval={updateInterval} 
        setRefreshRate={setRefreshRate} 
      />
      
      {/* Only render status cards when data is available */}
      {networkStatus && (
        <NetworkStatusCards 
          networkStatus={networkStatus} 
          isLoading={isLoading}
          handleGatewayClick={handleGatewayClickLocal} 
        />
      )}
      
      <Button 
        variant="outline" 
        onClick={throttledRefresh}
        className="w-full mt-2 hover:bg-primary/5"
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <div className="flex items-center">
            <Signal className="mr-2 h-4 w-4 animate-spin" />
            Refreshing...
          </div>
        ) : (
          <div className="flex items-center">
            <Signal className="mr-2 h-4 w-4" />
            Refresh Network Data
          </div>
        )}
      </Button>
      
      {/* Only render modal when needed */}
      {isMockRouterOpen && (
        <MockRouterAdmin
          open={isMockRouterOpen}
          onClose={() => setIsMockRouterOpen(false)}
          gatewayIp={networkStatus?.gatewayIp || '192.168.1.1'}
          isRealNetwork={false}
        />
      )}
    </div>
  );
};

export default memo(NetworkOverviewOptimized);
