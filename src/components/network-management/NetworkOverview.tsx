
import React, { useState, useEffect } from 'react';
import { NetworkStatusSection } from './sections/NetworkStatusSection';
import { NetworkDeviceTabs } from '../overview/NetworkDeviceTabs';
import { UpdateFrequencyControl } from './UpdateFrequencyControl';
import { NetworkStatusCards } from '../overview/NetworkStatusCards';
import { NetworkStatus } from '@/hooks/network/types';
import { NetworkRefreshButton } from './overview/NetworkRefreshButton';
import { RouterDialog } from './overview/RouterDialog';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [isMockRouterOpen, setIsMockRouterOpen] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  
  // Reset error shown state when networkStatus changes
  useEffect(() => {
    if (networkStatus) {
      setErrorShown(false);
    }
  }, [networkStatus]);

  const handleGatewayClickLocal = () => {
    setIsMockRouterOpen(true);
  };
  
  const handleRetry = () => {
    toast.info("Retrying network connection...");
    setErrorShown(true);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {!networkStatus && !isLoading && !errorShown && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to fetch network status. Please try again.</span>
            <NetworkRefreshButton 
              isRefreshing={isRefreshing}
              handleRefresh={handleRetry}
              label="Try Again"
            />
          </AlertDescription>
        </Alert>
      )}
      
      <NetworkStatusSection 
        networkStatus={networkStatus}
        isLoading={isLoading}
        handleGatewayClick={handleGatewayClickLocal}
      />

      <NetworkDeviceTabs 
        networkStatus={networkStatus} 
        isLoading={isLoading} 
      />
      
      <UpdateFrequencyControl 
        updateInterval={updateInterval} 
        setRefreshRate={setRefreshRate} 
      />
      
      <NetworkStatusCards 
        networkStatus={networkStatus} 
        isLoading={isLoading}
        handleGatewayClick={handleGatewayClickLocal} 
      />
      
      <NetworkRefreshButton 
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
      />
      
      <RouterDialog
        isOpen={isMockRouterOpen}
        onClose={() => setIsMockRouterOpen(false)}
        gatewayIp={networkStatus?.gatewayIp || '192.168.1.1'}
      />
    </div>
  );
};
