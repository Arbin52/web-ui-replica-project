
import React, { useState, useEffect, useRef, memo } from 'react';
import { Signal, Database, Shield, Wifi, Router } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NetworkStatusCards } from '../overview/NetworkStatusCards';
import { NetworkDeviceTabs } from '../overview/NetworkDeviceTabs';
import { DashboardCard } from '../ui/dashboard-card';
import { UpdateFrequencyControl } from './UpdateFrequencyControl';
import { NetworkStatus } from '@/hooks/network/types';
import { Card, CardContent } from '@/components/ui/card';
import MockRouterAdmin from './MockRouterAdmin';

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
  // State for smooth display values with refs to prevent re-renders
  const [displayDownload, setDisplayDownload] = useState<number>(0);
  const [displayUpload, setDisplayUpload] = useState<number>(0);
  const [isMockRouterOpen, setIsMockRouterOpen] = useState(false);
  
  // Use refs for animation frames to improve performance
  const downloadAnimFrameRef = useRef<number | null>(null);
  const uploadAnimFrameRef = useRef<number | null>(null);
  const previousNetworkStatus = useRef<NetworkStatus | null>(null);
  
  // Memoize the gateway click handler
  const handleGatewayClickLocal = React.useCallback(() => {
    setIsMockRouterOpen(true);
  }, []);
  
  // Only update animations when networkStatus actually changes
  useEffect(() => {
    if (!networkStatus || 
        (previousNetworkStatus.current?.connectionSpeed.download === networkStatus.connectionSpeed.download &&
         previousNetworkStatus.current?.connectionSpeed.upload === networkStatus.connectionSpeed.upload)) {
      return;
    }
    
    previousNetworkStatus.current = networkStatus;
    const targetDownload = networkStatus.connectionSpeed.download;
    
    if (downloadAnimFrameRef.current) {
      cancelAnimationFrame(downloadAnimFrameRef.current);
    }
    
    const updateDownload = () => {
      setDisplayDownload(prev => {
        const diff = targetDownload - prev;
        const step = diff * 0.01; // More performant step size
        
        if (Math.abs(diff) < 0.1) return targetDownload;
        const newValue = prev + step;
        
        if (Math.abs(targetDownload - newValue) > 0.1) {
          downloadAnimFrameRef.current = requestAnimationFrame(updateDownload);
        }
        
        return newValue;
      });
    };
    
    downloadAnimFrameRef.current = requestAnimationFrame(updateDownload);
    
    return () => {
      if (downloadAnimFrameRef.current) {
        cancelAnimationFrame(downloadAnimFrameRef.current);
      }
    };
  }, [networkStatus?.connectionSpeed.download]);
  
  // Optimize upload speed animation
  useEffect(() => {
    if (!networkStatus || 
        previousNetworkStatus.current?.connectionSpeed.upload === networkStatus.connectionSpeed.upload) {
      return;
    }
    
    const targetUpload = networkStatus.connectionSpeed.upload;
    
    if (uploadAnimFrameRef.current) {
      cancelAnimationFrame(uploadAnimFrameRef.current);
    }
    
    const updateUpload = () => {
      setDisplayUpload(prev => {
        const diff = targetUpload - prev;
        const step = diff * 0.01; // More performant
        
        if (Math.abs(diff) < 0.1) return targetUpload;
        const newValue = prev + step;
        
        if (Math.abs(targetUpload - newValue) > 0.1) {
          uploadAnimFrameRef.current = requestAnimationFrame(updateUpload);
        }
        
        return newValue;
      });
    };
    
    uploadAnimFrameRef.current = requestAnimationFrame(updateUpload);
    
    return () => {
      if (uploadAnimFrameRef.current) {
        cancelAnimationFrame(uploadAnimFrameRef.current);
      }
    };
  }, [networkStatus?.connectionSpeed.upload]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${networkStatus?.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <Wifi size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  {networkStatus?.networkName || "Not Connected"}
                </h2>
                <p className="text-muted-foreground">
                  {networkStatus?.isOnline ? 
                    `Connected via ${networkStatus?.networkType || 'WiFi'}` : 
                    "No active connection"}
                </p>
              </div>
            </div>
            {networkStatus?.isOnline && (
              <Button variant="outline" className="gap-1" onClick={handleGatewayClickLocal}>
                <Router size={16} />
                <span>Gateway: {networkStatus?.gatewayIp}</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <StatusCard 
              title="Network Status"
              value={networkStatus?.isOnline ? "Online" : "Offline"}
              icon={<Signal size={18} />}
              description="Current connection status"
              isLoading={isLoading}
              className={`animate-fade-in ${networkStatus?.isOnline ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
            />
            <StatusCard 
              title="Download"
              value={`${displayDownload.toFixed(1)} Mbps`}
              icon={<Database size={18} />}
              description="Current download speed"
              isLoading={isLoading}
              className="animate-fade-in"
            />
            <StatusCard 
              title="Upload"
              value={`${displayUpload.toFixed(1)} Mbps`}
              icon={<Database size={18} />}
              description="Current upload speed"
              isLoading={isLoading}
              className="animate-fade-in"
            />
            <StatusCard 
              title="Security"
              value={networkStatus?.availableNetworks?.find(n => n.ssid === networkStatus.networkName)?.security || "N/A"}
              icon={<Shield size={18} />}
              description="Security protocol"
              isLoading={isLoading}
              className="animate-fade-in"
            />
          </div>
        </CardContent>
      </Card>

      {/* Only render tabs when data is available */}
      {!isLoading && networkStatus && (
        <NetworkDeviceTabs 
          networkStatus={networkStatus} 
          isLoading={isLoading} 
        />
      )}
      
      <UpdateFrequencyControl 
        updateInterval={updateInterval} 
        setRefreshRate={setRefreshRate} 
      />
      
      {/* Conditionally render status cards to improve performance */}
      {!isLoading && networkStatus && (
        <NetworkStatusCards 
          networkStatus={networkStatus} 
          isLoading={isLoading}
          handleGatewayClick={handleGatewayClickLocal} 
        />
      )}
      
      <Button 
        variant="outline" 
        onClick={handleRefresh}
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

export default NetworkOverviewOptimized;
