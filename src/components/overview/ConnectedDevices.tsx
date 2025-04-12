
import React from 'react';
import { Router, Smartphone, Laptop, Monitor, Tv, TabletIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DeviceList } from '@/components/devices/DeviceList';
import { NetworkStatus } from '@/hooks/network/types';

interface ConnectedDevicesProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const ConnectedDevices: React.FC<ConnectedDevicesProps> = ({ networkStatus, isLoading }) => {
  // Function to get device icon based on device type
  const getDeviceIcon = (deviceType: string) => {
    switch(deviceType.toLowerCase()) {
      case 'smartphone':
        return <Smartphone size={16} />;
      case 'laptop':
        return <Laptop size={16} />;
      case 'desktop':
      case 'computer':
        return <Monitor size={16} />;
      case 'tv':
      case 'television':
        return <Tv size={16} />;
      case 'tablet':
        return <TabletIcon size={16} />;
      default:
        return <Smartphone size={16} />;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex items-center gap-2">
          <Router size={18} className="text-primary" />
          <CardTitle className="text-lg">
            Connected Devices 
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({isLoading ? '...' : networkStatus?.connectedDevices.length})
            </span>
          </CardTitle>
        </div>
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
            {networkStatus?.connectedDevices && networkStatus.connectedDevices.length > 0 ? (
              <div className="grid gap-2">
                {networkStatus.connectedDevices.map((device) => (
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
