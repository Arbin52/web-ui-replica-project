
import React, { useState, useCallback, memo } from 'react';
import { Router, Smartphone, Laptop, Monitor, Tv, TabletIcon, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetworkStatus } from '@/hooks/network/types';
import { getConnectedDeviceStatus, ConnectedDevice } from '@/hooks/network/connectedDevices';

interface ConnectedDevicesProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

// Lightweight device item component
const DeviceItem = memo(({ device, isOnline }: { device: ConnectedDevice, isOnline: boolean }) => {
  // Simple icon selection without complex logic
  const getDeviceIcon = () => {
    switch(device.type.toLowerCase()) {
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

  // Highlight if this is the current device
  const isCurrentDevice = device.name.includes('This Device') || 
                         (device.ip === '192.168.1.2' && device.id === 1);

  return (
    <div className={`flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors border ${isCurrentDevice ? 'bg-primary/5 border-primary/20' : 'bg-background border-muted'}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${isCurrentDevice ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          {getDeviceIcon()}
        </div>
        <div>
          <div className="font-medium flex items-center">
            {device.name}
            {isCurrentDevice && <span className="ml-1 text-xs text-primary">(This Device)</span>}
          </div>
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
  // Use local state to prevent re-renders from parent
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isOnline = navigator.onLine; // Direct browser API
  
  // Detect user's current device type
  const getCurrentDeviceType = () => {
    if (navigator.userAgent.includes('Mobile')) return 'Smartphone';
    if (navigator.userAgent.includes('iPad')) return 'Tablet';
    if (navigator.userAgent.includes('Mac')) return 'Laptop';
    if (navigator.userAgent.includes('Windows')) return 'Computer';
    return 'Computer';
  };

  // Create current device object
  const getCurrentDeviceObj = useCallback((): ConnectedDevice => {
    return {
      id: 1, // Use ID 1 to always put current device first
      name: "This Device", 
      ip: networkStatus?.localIp || '192.168.1.2',
      mac: networkStatus?.macAddress || '00:1B:44:11:3A:B7',
      type: getCurrentDeviceType() as 'Wired' | 'Wireless',
      status: 'Online',
      lastSeen: new Date()
    };
  }, [networkStatus?.localIp, networkStatus?.macAddress]);
  
  // Load devices from storage and ensure current device is included
  React.useEffect(() => {
    const loadDevices = () => {
      // Get devices from local storage/memory
      const localDevices = getConnectedDeviceStatus();
      
      // Always ensure current device is in the list and at the top
      const currentDevice = getCurrentDeviceObj();
      
      // Remove any device with id 1 to avoid duplicates
      const filteredDevices = localDevices.filter(d => d.id !== 1);
      
      // Add current device at the beginning
      setDevices([currentDevice, ...filteredDevices]);
    };
    
    loadDevices();
  }, [networkStatus, getCurrentDeviceObj]);

  // Simple refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      // Get devices but make sure our current device is still there
      const localDevices = getConnectedDeviceStatus();
      const currentDevice = getCurrentDeviceObj();
      const filteredDevices = localDevices.filter(d => d.id !== 1);
      setDevices([currentDevice, ...filteredDevices]);
      setRefreshing(false);
    }, 100);
  }, [getCurrentDeviceObj]);

  // Simple loading state
  if (isLoading || refreshing) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Router size={18} className="text-primary" />
              <CardTitle className="text-lg">Connected Devices</CardTitle>
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
