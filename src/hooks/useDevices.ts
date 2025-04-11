
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'unknown';

export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  macAddress: string;
  type: string;
  status: DeviceStatus;
  lastSeen: Date;
  connectionType: 'wired' | 'wireless';
  signalStrength?: number;
  manufacturer?: string;
  model?: string;
}

// Mock data fetching function - would be replaced with real API call
const fetchDevices = async (): Promise<Device[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data for now
  return [
    {
      id: '1',
      name: 'Living Room PC',
      ipAddress: '192.168.1.100',
      macAddress: 'AA:BB:CC:DD:EE:FF',
      type: 'computer',
      status: 'online',
      lastSeen: new Date(),
      connectionType: 'wired',
      manufacturer: 'Dell',
      model: 'XPS 15'
    },
    {
      id: '2',
      name: 'iPhone',
      ipAddress: '192.168.1.101',
      macAddress: 'AA:BB:CC:DD:EE:11',
      type: 'mobile',
      status: 'online',
      lastSeen: new Date(),
      connectionType: 'wireless',
      signalStrength: 85,
      manufacturer: 'Apple',
      model: 'iPhone 15'
    },
    {
      id: '3',
      name: 'Smart TV',
      ipAddress: '192.168.1.102',
      macAddress: 'AA:BB:CC:DD:EE:22',
      type: 'entertainment',
      status: 'warning',
      lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
      connectionType: 'wireless',
      signalStrength: 65,
      manufacturer: 'Samsung',
      model: 'QN90A'
    },
    {
      id: '4',
      name: 'Guest Laptop',
      ipAddress: '192.168.1.103',
      macAddress: 'AA:BB:CC:DD:EE:33',
      type: 'computer',
      status: 'offline',
      lastSeen: new Date(Date.now() - 86400000), // 1 day ago
      connectionType: 'wireless',
      signalStrength: 0,
      manufacturer: 'HP',
      model: 'Spectre x360'
    }
  ];
};

export function useDevices() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const { 
    data: devices = [], 
    isLoading,
    error, 
    refetch
  } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load connected devices");
      console.error("Device loading error:", error);
    }
  }, [error]);
  
  const devicesByStatus = {
    online: devices.filter(device => device.status === 'online'),
    offline: devices.filter(device => device.status === 'offline'),
    warning: devices.filter(device => device.status === 'warning'),
    unknown: devices.filter(device => device.status === 'unknown'),
  };
  
  const devicesByType = {
    computer: devices.filter(device => device.type === 'computer'),
    mobile: devices.filter(device => device.type === 'mobile'),
    entertainment: devices.filter(device => device.type === 'entertainment'),
    iot: devices.filter(device => device.type === 'iot'),
    other: devices.filter(device => 
      !['computer', 'mobile', 'entertainment', 'iot'].includes(device.type)
    ),
  };
  
  const connectionStats = {
    total: devices.length,
    wired: devices.filter(d => d.connectionType === 'wired').length,
    wireless: devices.filter(d => d.connectionType === 'wireless').length,
    online: devicesByStatus.online.length,
    offline: devicesByStatus.offline.length,
    warning: devicesByStatus.warning.length,
  };

  const refreshDevices = () => {
    refetch();
    toast.info("Refreshing device list...");
  };

  return {
    devices,
    devicesByStatus,
    devicesByType,
    connectionStats,
    selectedDevice,
    setSelectedDevice,
    isLoading,
    error,
    refreshDevices
  };
}
