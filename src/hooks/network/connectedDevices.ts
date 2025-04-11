
export const generateConnectedDevices = (count: number = 5) => {
  // Standard devices that are always connected
  const baseDevices = [
    { id: 1, name: 'Windows PC', ip: '192.168.1.2', mac: '00:1B:44:11:3A:B7', type: 'Wired' },
    { id: 2, name: 'MacBook Pro', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wireless' },
  ];
  
  // Optional devices that may connect/disconnect
  const optionalDevices = [
    { id: 3, name: 'iPhone 13', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' },
    { id: 4, name: 'Samsung Smart TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' },
    { id: 5, name: 'Google Nest', ip: '192.168.1.6', mac: '00:1A:2B:3C:4D:61', type: 'Wireless' },
    { id: 6, name: 'iPad Pro', ip: '192.168.1.7', mac: '00:1A:2B:3C:4D:62', type: 'Wireless' },
    { id: 7, name: 'Android Phone', ip: '192.168.1.8', mac: '00:1A:2B:3C:4D:63', type: 'Wireless' },
    { id: 8, name: 'Gaming Console', ip: '192.168.1.9', mac: '00:1A:2B:3C:4D:64', type: 'Wired' }
  ];
  
  // Normalize count to ensure it's within valid range
  const normalizedCount = Math.max(2, Math.min(count, baseDevices.length + optionalDevices.length));
  
  // Combine base devices with some optional devices based on count
  const result = [
    ...baseDevices,
    ...optionalDevices.slice(0, normalizedCount - baseDevices.length)
  ];
  
  // Save the current count for persistence
  localStorage.setItem('connected_device_count', normalizedCount.toString());
  
  return result;
};

// Function to simulate a new device connecting
export const connectNewDevice = () => {
  const currentCount = parseInt(localStorage.getItem('connected_device_count') || '5');
  const newCount = Math.min(currentCount + 1, 8); // Maximum 8 devices
  localStorage.setItem('connected_device_count', newCount.toString());
  return newCount;
};

// Function to simulate a device disconnecting
export const disconnectDevice = () => {
  const currentCount = parseInt(localStorage.getItem('connected_device_count') || '5');
  const newCount = Math.max(currentCount - 1, 2); // Minimum 2 devices
  localStorage.setItem('connected_device_count', newCount.toString());
  return newCount;
};
