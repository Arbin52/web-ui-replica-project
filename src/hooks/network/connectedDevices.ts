
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
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored devices:', e);
    }
  }
  // Return empty array if no valid stored devices
  return [];
};

const saveStoredDevices = (devices: ConnectedDevice[]) => {
  if (Array.isArray(devices) && devices.length > 0) {
    localStorage.setItem('connected_devices', JSON.stringify(devices));
  }
};

export const generateConnectedDevices = (count: number = 5) => {
  // Check for existing stored devices first
  const storedDevices = getStoredDevices();
  if (storedDevices.length > 0) {
    console.log("Found stored devices:", storedDevices.length);
    return storedDevices;
  }
  
  console.log("Generating new connected devices");
  
  // Standard devices that are always connected
  const baseDevices = [
    { id: 1, name: 'Windows PC', ip: '192.168.1.2', mac: '00:1B:44:11:3A:B7', type: 'Wired' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 2, name: 'MacBook Pro', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 3, name: 'iPhone 13', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 4, name: 'Samsung Smart TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
    { id: 5, name: 'Google Nest', ip: '192.168.1.6', mac: '00:1A:2B:3C:4D:61', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
  ];
  
  // Save to localStorage for persistence
  saveStoredDevices(baseDevices);
  
  return baseDevices;
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
  
  // Find non-base device to disconnect (device with id > 5)
  const optionalDeviceIndex = devices.findIndex(d => d.id > 5);
  
  if (optionalDeviceIndex > -1) {
    devices.splice(optionalDeviceIndex, 1);
    saveStoredDevices(devices);
  }
  
  return devices.length;
};

// Get the status of connected devices
export const getConnectedDeviceStatus = () => {
  const devices = getStoredDevices();
  // If we don't have any stored devices, generate some
  if (devices.length === 0) {
    return generateConnectedDevices();
  }
  return devices;
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
