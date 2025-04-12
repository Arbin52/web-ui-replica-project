
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Signal, Database, Shield, Wifi, Router } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NetworkStatusCards } from '../overview/NetworkStatusCards';
import { NetworkDeviceTabs } from '../overview/NetworkDeviceTabs';
import { DashboardCard } from '../ui/dashboard-card';
import { UpdateFrequencyControl } from './UpdateFrequencyControl';
import { NetworkStatus } from '@/hooks/network/types';
import { Card, CardContent } from '@/components/ui/card';

interface NetworkOverviewProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleGatewayClick: () => void;
  updateInterval: number;
  setRefreshRate: (interval: number) => void;
}

export const NetworkOverview: React.FC<NetworkOverviewProps> = ({
  networkStatus,
  isLoading,
  isRefreshing,
  handleRefresh,
  handleGatewayClick,
  updateInterval,
  setRefreshRate
}) => {
  // State for smooth display values
  const [displayDownload, setDisplayDownload] = useState<number>(0);
  const [displayUpload, setDisplayUpload] = useState<number>(0);
  
  // Animation frame refs for smoother animation
  const downloadAnimFrameRef = useRef<number | null>(null);
  const uploadAnimFrameRef = useRef<number | null>(null);
  
  // Effect to smoothly transition download speed using requestAnimationFrame
  useEffect(() => {
    if (!networkStatus) return;
    
    const targetDownload = networkStatus.connectionSpeed.download;
    
    // Cancel any existing animation
    if (downloadAnimFrameRef.current) {
      cancelAnimationFrame(downloadAnimFrameRef.current);
    }
    
    const updateDownload = () => {
      setDisplayDownload(prev => {
        const diff = targetDownload - prev;
        // Drastically slow down transition speed for more readable display
        const step = diff * 0.005; // Reduced to 0.005 for even smoother transition
        
        if (Math.abs(diff) < 0.1) return targetDownload;
        const newValue = prev + step;
        
        // Continue animation if not finished
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
  
  // Effect to smoothly transition upload speed using requestAnimationFrame
  useEffect(() => {
    if (!networkStatus) return;
    
    const targetUpload = networkStatus.connectionSpeed.upload;
    
    // Cancel any existing animation
    if (uploadAnimFrameRef.current) {
      cancelAnimationFrame(uploadAnimFrameRef.current);
    }
    
    const updateUpload = () => {
      setDisplayUpload(prev => {
        const diff = targetUpload - prev;
        // Drastically slow down transition speed for more readable display
        const step = diff * 0.005; // Reduced to 0.005 for even smoother transition
        
        if (Math.abs(diff) < 0.1) return targetUpload;
        const newValue = prev + step;
        
        // Continue animation if not finished
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
      {/* Current Network Status */}
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
            <div className="flex gap-2">
              {networkStatus?.isOnline && (
                <Button variant="outline" className="gap-1" onClick={handleGatewayClick}>
                  <Router size={16} />
                  <span>Gateway: {networkStatus?.gatewayIp}</span>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <DashboardCard 
              title="Network Status"
              value={networkStatus?.isOnline ? "Online" : "Offline"}
              icon={<Signal size={18} />}
              description="Current connection status"
              isLoading={isLoading}
              className={`animate-fade-in ${networkStatus?.isOnline ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
            />
            <DashboardCard 
              title="Download"
              value={`${displayDownload.toFixed(1)} Mbps`}
              icon={<Database size={18} />}
              description="Current download speed"
              isLoading={isLoading}
              className="animate-fade-in"
            />
            <DashboardCard 
              title="Upload"
              value={`${displayUpload.toFixed(1)} Mbps`}
              icon={<Database size={18} />}
              description="Current upload speed"
              isLoading={isLoading}
              className="animate-fade-in"
            />
            <DashboardCard 
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

      {/* Network Device Tabs - Connected and Available Networks */}
      <NetworkDeviceTabs 
        networkStatus={networkStatus} 
        isLoading={isLoading} 
      />
      
      {/* Update Frequency Control */}
      <UpdateFrequencyControl 
        updateInterval={updateInterval} 
        setRefreshRate={setRefreshRate} 
      />
      
      {/* Additional Network Status Info Cards */}
      <NetworkStatusCards 
        networkStatus={networkStatus} 
        isLoading={isLoading}
        handleGatewayClick={handleGatewayClick} 
      />
      
      {/* Manual Refresh Button */}
      <Button 
        variant="outline" 
        onClick={handleRefresh}
        className="w-full mt-2 hover:bg-primary/5"
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Refresh Network Data
      </Button>
    </div>
  );
};
