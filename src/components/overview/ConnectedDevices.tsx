
import React, { useEffect } from 'react';
import { Router, Smartphone, Laptop, Monitor, Tv, TabletIcon, RefreshCw, WifiOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { NetworkStatus } from '@/hooks/network/types';
import { useRealDevices } from '@/hooks/useRealDevices';
import { toast } from 'sonner';

interface ConnectedDevicesProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const ConnectedDevices: React.FC<ConnectedDevicesProps> = ({ networkStatus, isLoading: networkIsLoading }) => {
  const { 
    devices, 
    isLoading: devicesLoading, 
    hasScanner, 
    isScanning,
    refreshDevices,
    startNetworkScan,
    checkScannerAvailability
  } = useRealDevices();
  
  // Use real devices if scanner is available, otherwise use mock devices from networkStatus
  const displayDevices = hasScanner ? devices : networkStatus?.connectedDevices || [];
  const isLoading = hasScanner ? devicesLoading : networkIsLoading;
  
  useEffect(() => {
    // Check for scanner on component mount
    checkScannerAvailability();
  }, []);

  // Function to get device icon based on device type
  const getDeviceIcon = (deviceType: string) => {
    switch(deviceType.toLowerCase()) {
      case 'smartphone':
      case 'mobile':
      case 'phone':
        return <Smartphone size={16} />;
      case 'laptop':
        return <Laptop size={16} />;
      case 'desktop':
      case 'computer':
      case 'pc':
        return <Monitor size={16} />;
      case 'tv':
      case 'television':
      case 'smarttv':
        return <Tv size={16} />;
      case 'tablet':
        return <TabletIcon size={16} />;
      default:
        return <Smartphone size={16} />;
    }
  };

  const handleRefresh = async () => {
    if (hasScanner) {
      await refreshDevices();
    } else {
      toast.info('Checking for scanner availability...');
      await checkScannerAvailability();
    }
  };

  const handleScan = async () => {
    if (hasScanner) {
      await startNetworkScan();
    } else {
      toast.error('Network scanner not available');
      checkScannerAvailability();
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Router size={18} className="text-primary" />
            <CardTitle className="text-lg">
              Connected Devices 
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({isLoading ? '...' : displayDevices.length})
              </span>
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading || isScanning}
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </Button>
            {hasScanner && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleScan} 
                disabled={isLoading || isScanning}
              >
                {isScanning ? "Scanning..." : "Scan"}
              </Button>
            )}
          </div>
        </div>
        {hasScanner && (
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Using real device scanner
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {!hasScanner && (
              <div className="mb-4 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md flex items-center gap-2 text-sm">
                <WifiOff size={16} />
                <span>Network scanner not connected. Device list may not be accurate.</span>
                <Button variant="link" className="text-xs ml-auto p-0 h-auto" onClick={checkScannerAvailability}>
                  Check scanner
                </Button>
              </div>
            )}
            
            {displayDevices && displayDevices.length > 0 ? (
              <div className="grid gap-2">
                {displayDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-muted/50 transition-colors border border-muted">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">{device.ip}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${device.status ? (device.status === 'Online' ? 'bg-green-500' : 'bg-red-500') : 'bg-green-500'}`}></div>
                      <span className="text-sm">{device.status || 'Online'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Router className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>No devices connected</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
