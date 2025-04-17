
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

// Default devices that are always available
const defaultDevices = [
  { id: 1, name: 'Windows PC', ip: '192.168.1.2', mac: '00:1B:44:11:3A:B7', type: 'Wired' as const, status: 'Online' as const, lastSeen: new Date() },
  { id: 2, name: 'MacBook Pro', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() },
  { id: 3, name: 'iPhone 13', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' as const, status: 'Online' as const, lastSeen: new Date() }
];

// Store connected devices in localStorage for persistence
const getStoredDevices = (): ConnectedDevice[] => {
  const stored = localStorage.getItem('connected_devices');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure lastSeen is properly converted to Date objects
        return parsed.map(device => ({
          ...device,
          lastSeen: device.lastSeen ? new Date(device.lastSeen) : new Date()
        }));
      }
    } catch (e) {
      console.error('Error parsing stored devices:', e);
    }
  }
  
  // Return default devices if no valid stored devices
  return [...defaultDevices];
};

const saveStoredDevices = (devices: ConnectedDevice[]) => {
  if (Array.isArray(devices)) {
    localStorage.setItem('connected_devices', JSON.stringify(devices));
  }
};

export const generateConnectedDevices = (count: number = 3) => {
  // Check for existing stored devices first
  const storedDevices = getStoredDevices();
  if (storedDevices.length > 0) {
    console.log("Found stored devices:", storedDevices.length);
    return storedDevices;
  }
  
  console.log("Generating new connected devices");
  
  // Always include default devices
  const devices = [...defaultDevices];
  
  // Save to localStorage for persistence
  saveStoredDevices(devices);
  
  return devices;
};

// Get the status of connected devices - CRUCIAL function that must never return empty
export const getConnectedDeviceStatus = (): ConnectedDevice[] => {
  // Always get stored devices or generate new ones
  let devices = getStoredDevices();
  
  // If somehow we still don't have devices, use defaults
  if (!devices || devices.length === 0) {
    devices = [...defaultDevices];
    saveStoredDevices(devices);
  }
  
  // Always ensure all devices have a valid lastSeen date
  const updatedDevices = devices.map(device => ({
    ...device,
    lastSeen: device.lastSeen || new Date(),
    status: navigator.onLine ? 'Online' as const : 'Offline' as const // Use browser online status
  }));
  
  // Save the updated devices
  saveStoredDevices(updatedDevices);
  
  return updatedDevices;
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
  
  // We want to maintain at least 3 devices (the default ones)
  if (devices.length <= 3) {
    return devices.length;
  }
  
  // Find non-default device to disconnect (device with id > 5)
  const optionalDeviceIndex = devices.findIndex(d => d.id > 5);
  
  if (optionalDeviceIndex > -1) {
    devices.splice(optionalDeviceIndex, 1);
    saveStoredDevices(devices);
  }
  
  return devices.length;
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
