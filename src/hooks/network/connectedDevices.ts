
// Define a type for connected devices
export interface ConnectedDevice {
  id: number;
  name: string;
  ip: string;
  mac: string;
  type: 'Wired' | 'Wireless';
  status?: 'Online' | 'Offline';
  lastSeen?: Date;
}

// Store connected devices in localStorage for persistence
const getStoredDevices = (): ConnectedDevice[] => {
  const stored = localStorage.getItem('connected_devices');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored devices:', e);
    }
  }
  return [];
};

const saveStoredDevices = (devices: ConnectedDevice[]) => {
  localStorage.setItem('connected_devices', JSON.stringify(devices));
};

export const generateConnectedDevices = (count: number = 5) => {
  // Check for existing stored devices first
  const storedDevices = getStoredDevices();
  if (storedDevices.length > 0) {
    return storedDevices;
  }
  
  // Standard devices that are always connected
  const baseDevices = [
    { id: 1, name: 'Windows PC', ip: '192.168.1.2', mac: '00:1B:44:11:3A:B7', type: 'Wired' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 2, name: 'MacBook Pro', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
  ];
  
  // Optional devices that may connect/disconnect
  const optionalDevices = [
    { id: 3, name: 'iPhone 13', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 4, name: 'Samsung Smart TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 5, name: 'Google Nest', ip: '192.168.1.6', mac: '00:1A:2B:3C:4D:61', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 6, name: 'iPad Pro', ip: '192.168.1.7', mac: '00:1A:2B:3C:4D:62', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 7, name: 'Android Phone', ip: '192.168.1.8', mac: '00:1A:2B:3C:4D:63', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 8, name: 'Gaming Console', ip: '192.168.1.9', mac: '00:1A:2B:3C:4D:64', type: 'Wired' as const, status: 'Online' as const, lastSeen: new Date() }
  ];
  
  // Normalize count to ensure it's within valid range
  const normalizedCount = Math.max(2, Math.min(count, baseDevices.length + optionalDevices.length));
  
  // Combine base devices with some optional devices based on count
  const result = [
    ...baseDevices,
    ...optionalDevices.slice(0, normalizedCount - baseDevices.length)
  ];
  
  // Save to localStorage for persistence
  saveStoredDevices(result);
  localStorage.setItem('connected_device_count', normalizedCount.toString());
  
  return result;
};

// Function to simulate a new device connecting
export const connectNewDevice = () => {
  const devices = getStoredDevices();
  const deviceCount = devices.length;
  
  // Maximum 8 devices
  if (deviceCount >= 8) {
    return deviceCount;
  }
  
  const optionalDevices = [
    { id: 3, name: 'iPhone 13', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' as const },
    { id: 4, name: 'Samsung Smart TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' as const },
    { id: 5, name: 'Google Nest', ip: '192.168.1.6', mac: '00:1A:2B:3C:4D:61', type: 'Wireless' as const },
    { id: 6, name: 'iPad Pro', ip: '192.168.1.7', mac: '00:1A:2B:3C:4D:62', type: 'Wireless' as const },
    { id: 7, name: 'Android Phone', ip: '192.168.1.8', mac: '00:1A:2B:3C:4D:63', type: 'Wireless' as const },
    { id: 8, name: 'Gaming Console', ip: '192.168.1.9', mac: '00:1A:2B:3C:4D:64', type: 'Wired' as const }
  ];
  
  // Find a device that's not already connected
  for (const device of optionalDevices) {
    if (!devices.some(d => d.id === device.id)) {
      const newDevice = {
        ...device,
        status: 'Online' as const,
        lastSeen: new Date()
      };
      
      devices.push(newDevice);
      saveStoredDevices(devices);
      localStorage.setItem('connected_device_count', devices.length.toString());
      break;
    }
  }
  
  return devices.length;
};

// Function to simulate a device disconnecting
export const disconnectDevice = () => {
  const devices = getStoredDevices();
  
  // We want to maintain at least 2 devices
  if (devices.length <= 2) {
    return devices.length;
  }
  
  // Find non-base device to disconnect (device with id > 2)
  const optionalDeviceIndex = devices.findIndex(d => d.id > 2);
  
  if (optionalDeviceIndex > -1) {
    devices.splice(optionalDeviceIndex, 1);
    saveStoredDevices(devices);
    localStorage.setItem('connected_device_count', devices.length.toString());
  }
  
  return devices.length;
};

// Get the status of connected devices
export const getConnectedDeviceStatus = () => {
  return getStoredDevices();
};

// Update the status of a specific device
export const updateDeviceStatus = (deviceId: number, status: 'Online' | 'Offline') => {
  const devices = getStoredDevices();
  const deviceIndex = devices.findIndex(d => d.id === deviceId);
  
  if (deviceIndex > -1) {
    devices[deviceIndex] = {
      ...devices[deviceIndex],
      status,
      lastSeen: status === 'Online' ? new Date() : devices[deviceIndex].lastSeen
    };
    
    saveStoredDevices(devices);
    return true;
  }
  
  return false;
};
