
import React from 'react';
import { Device } from '@/hooks/useDevices';
import { 
  Laptop, Smartphone, Tv, Cable, Wifi, X,
  Clock, Radio, Cpu, HardDrive, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DeviceDetailProps {
  device: Device;
  onClose: () => void;
}

export function DeviceDetail({ device, onClose }: DeviceDetailProps) {
  const getDeviceIcon = () => {
    switch (device.type) {
      case 'computer':
        return <Laptop size={36} className="text-blue-500" />;
      case 'mobile':
        return <Smartphone size={36} className="text-green-500" />;
      case 'entertainment':
        return <Tv size={36} className="text-purple-500" />;
      default:
        return <Info size={36} className="text-gray-500" />;
    }
  };
  
  const getStatusColor = () => {
    switch (device.status) {
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

  const handleWakeOnLan = () => {
    toast.info(`Sending Wake-on-LAN packet to ${device.name}`);
    // Implement WoL functionality here
  };

  const handleDisconnect = () => {
    toast.info(`Disconnecting ${device.name} from network`);
    // Implement disconnect functionality here
  };

  const handleBlockDevice = () => {
    toast.success(`${device.name} has been blocked`);
    // Implement block functionality here
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {getDeviceIcon()}
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{device.name}</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className={cn("w-2 h-2 rounded-full mr-2", getStatusColor())}></span>
              <span className="capitalize">{device.status}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="w-32 text-gray-500">IP Address</span>
            <span className="font-mono">{device.ipAddress}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-32 text-gray-500">MAC Address</span>
            <span className="font-mono">{device.macAddress}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-32 text-gray-500">Connection</span>
            <span className="flex items-center">
              {device.connectionType === 'wired' ? (
                <Cable size={14} className="mr-1 text-blue-500" />
              ) : (
                <Wifi size={14} className="mr-1 text-blue-500" />
              )}
              {device.connectionType === 'wireless' ? 'Wireless' : 'Wired'}
              {device.signalStrength && ` (${device.signalStrength}%)`}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="w-32 text-gray-500">Manufacturer</span>
            <span>{device.manufacturer || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-32 text-gray-500">Model</span>
            <span>{device.model || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-32 text-gray-500">Last Seen</span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1 text-gray-400" />
              {new Date(device.lastSeen).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-medium mb-3">Device Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleWakeOnLan}
            disabled={device.status === 'online'}
          >
            <Radio size={14} />
            Wake on LAN
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => toast.info(`Pinging ${device.ipAddress}...`)}
          >
            <Radio size={14} />
            Ping Device
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => toast.info(`Scanning ports on ${device.ipAddress}...`)}
          >
            <Cpu size={14} />
            Port Scan
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => toast.info(`Checking bandwidth usage for ${device.name}...`)}
          >
            <HardDrive size={14} />
            Bandwidth Usage
          </Button>
          
          <Button 
            variant={device.status === 'online' ? "outline" : "ghost"} 
            size="sm"
            className={cn("flex items-center gap-1", 
              device.status === 'online' ? "text-red-600 hover:text-red-700" : "text-gray-400"
            )}
            disabled={device.status !== 'online'}
            onClick={handleDisconnect}
          >
            <X size={14} />
            Disconnect
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
            onClick={handleBlockDevice}
          >
            <X size={14} />
            Block Device
          </Button>
        </div>
      </div>
    </div>
  );
}
