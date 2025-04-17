
import React, { useEffect, useState, useCallback, memo } from 'react';
import { Router, Smartphone, Laptop, Monitor, Tv, TabletIcon, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetworkStatus } from '@/hooks/network/types';
import { getConnectedDeviceStatus, ConnectedDevice } from '@/hooks/network/connectedDevices';

interface ConnectedDevicesProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

// Use memo for device components to prevent unnecessary re-renders
const DeviceItem = memo(({ device, isOnline }: { device: ConnectedDevice, isOnline: boolean }) => {
  // Get device icon based on device type
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
        return <Router size={16} />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-muted/50 transition-colors border border-muted">
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
        <div className={`h-2.5 w-2.5 rounded-full ${isOnline && device.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm">{isOnline && device.status === 'Online' ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  );
});

export const ConnectedDevices: React.FC<ConnectedDevicesProps> = ({ networkStatus, isLoading }) => {
  // Always use local devices to ensure we have something to display
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isOnline = navigator.onLine;
  
  // Load devices on mount only, then update when status changes
  useEffect(() => {
    // Use a simpler approach that won't cause blocking
    setDevices(getConnectedDeviceStatus());
  }, [networkStatus?.isOnline]);

  // Memoize the refresh handler to prevent re-renders
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      const updatedDevices = getConnectedDeviceStatus();
      setDevices(updatedDevices);
      setRefreshing(false);
    }, 100);
  }, []);

  // Loading state
  if (isLoading || refreshing) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Router size={18} className="text-primary" />
              <CardTitle className="text-lg">
                Connected Devices
                <span className="ml-2 text-sm font-normal text-muted-foreground">(...)</span>
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" disabled>
              <RefreshCw size={14} className="animate-spin" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          Loading devices...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Router size={18} className="text-primary" />
            <CardTitle className="text-lg">
              Connected Devices 
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({devices.length})
              </span>
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="max-h-96 overflow-y-auto">
          <div className="grid gap-2">
            {devices.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No devices found
              </div>
            ) : (
              devices.map((device) => (
                <DeviceItem key={device.id} device={device} isOnline={isOnline} />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
