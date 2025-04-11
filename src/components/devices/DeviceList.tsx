
import React from 'react';
import { Device, useDevices } from '@/hooks/useDevices';
import { Laptop, Smartphone, Tv, CircleAlert, Wifi, Cable } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceListProps {
  filter?: 'all' | 'online' | 'offline' | 'warning';
  onSelectDevice?: (device: Device) => void;
  className?: string;
}

export function DeviceList({ filter = 'all', onSelectDevice, className }: DeviceListProps) {
  const { devices, isLoading } = useDevices();
  
  const getFilteredDevices = () => {
    if (filter === 'all') return devices;
    return devices.filter(device => device.status === filter);
  };

  const getDeviceIcon = (device: Device) => {
    switch (device.type) {
      case 'computer':
        return <Laptop size={18} />;
      case 'mobile':
        return <Smartphone size={18} />;
      case 'entertainment':
        return <Tv size={18} />;
      default:
        return <Laptop size={18} />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  const getConnectionIcon = (type: 'wired' | 'wireless') => {
    return type === 'wired' ? <Cable size={14} /> : <Wifi size={14} />;
  };

  const filteredDevices = getFilteredDevices();
  
  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex items-center p-3 border rounded-md">
            <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (filteredDevices.length === 0) {
    return (
      <div className={cn("text-center py-6 border rounded-md bg-gray-50", className)}>
        <CircleAlert className="mx-auto text-gray-400 mb-2" size={24} />
        <p className="text-gray-500">No devices found</p>
      </div>
    );
  }
  
  return (
    <div className={cn("divide-y border rounded-md overflow-hidden", className)}>
      {filteredDevices.map((device) => (
        <div 
          key={device.id}
          className="flex items-center p-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onSelectDevice?.(device)}
        >
          <div className="mr-3 text-gray-500">
            {getDeviceIcon(device)}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{device.name}</span>
              <span className={cn("ml-2 w-2 h-2 rounded-full", getStatusColor(device.status))}></span>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>{device.ipAddress}</span>
              <span className="mx-1">•</span>
              <span className="flex items-center gap-0.5">
                {getConnectionIcon(device.connectionType)}
                {device.connectionType === 'wireless' && device.signalStrength && 
                  `${device.signalStrength}%`
                }
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(device.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
}
