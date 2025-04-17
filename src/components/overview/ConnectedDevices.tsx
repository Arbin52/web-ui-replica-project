
import React, { useEffect, useState } from 'react';
import { Router, Smartphone, Laptop, Monitor, Tv, TabletIcon, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetworkStatus } from '@/hooks/network/types';
import { getConnectedDeviceStatus, ConnectedDevice } from '@/hooks/network/connectedDevices';

interface ConnectedDevicesProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const ConnectedDevices: React.FC<ConnectedDevicesProps> = ({ networkStatus, isLoading }) => {
  // Always use local devices to ensure we have something to display
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load devices on mount and whenever network status changes
  useEffect(() => {
    setDevices(getConnectedDeviceStatus());
  }, [networkStatus?.isOnline]);

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
        return <Router size={16} />;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simple refresh without complex logic
    const updatedDevices = getConnectedDeviceStatus();
    setDevices(updatedDevices);
    setTimeout(() => setRefreshing(false), 500);
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
                ({isLoading || refreshing ? '...' : devices.length})
              </span>
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading || refreshing}
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading || refreshing ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading devices...
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <div className="grid gap-2">
              {devices.map((device) => (
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
                    <div className={`h-2.5 w-2.5 rounded-full ${navigator.onLine && device.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">{navigator.onLine && device.status === 'Online' ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
