
import { fetchRealNetworkInfo } from './realNetworkInfo';
import { generateConnectedDevices } from './connectedDevices';
import { getAvailableNetworks } from './availableNetworks';
import { NetworkStatus } from './types';
import { toast } from 'sonner';

export const generateNetworkStatus = async (previousStatus: NetworkStatus | null): Promise<NetworkStatus> => {
  // Try to get real network information where possible
  const realNetworkInfo = await fetchRealNetworkInfo();
  
  // Get device connection counts to simulate real-time connected devices
  const connectedDeviceCount = parseInt(localStorage.getItem('connected_device_count') || '5');
  
  // Generate realistic dynamic values for what we can't get from the browser
  const signalStrengthDb = -(Math.floor(Math.random() * 30) + 40); // Stronger signal than before
  const downloadSpeed = Math.floor(Math.random() * 30) + 90; // Higher speed for 5G network
  const uploadSpeed = Math.floor(Math.random() * 10) + 20; // Higher upload for 5G
  const latency = Math.floor(Math.random() * 10) + 3; // Lower latency for 5G
  
  // Data usage simulated values
  const downloadData = Math.floor(Math.random() * 500) + 1000; // Between 1000-1500 MB
  const uploadData = Math.floor(Math.random() * 200) + 300; // Between 300-500 MB

  // Connection status history 
  const history = previousStatus?.connectionHistory || [];
  if (history.length > 20) history.shift(); // Keep only last 20 entries

  // Use real online status if available, otherwise simulate occasional disconnection
  const isCurrentlyOnline = realNetworkInfo.isOnline ?? (Math.random() > 0.01);
  
  // Add connection event if status changed
  if (previousStatus?.isOnline !== isCurrentlyOnline) {
    history.push({
      timestamp: new Date(),
      status: isCurrentlyOnline ? 'connected' : 'disconnected'
    });
    
    // Show toast notification on disconnection
    if (!isCurrentlyOnline) {
      toast.error("Network connection lost");
    } else if (previousStatus !== null) {
      // Only show reconnect toast if not first connection
      toast.success("Network connection restored");
    }
  }
  
  // Generate sample available networks from the user's image
  const availableNetworks = getAvailableNetworks();
  
  // Check for connected network in available networks
  const networkName = realNetworkInfo.networkName || 'YAKSO HOSTEL 5G';
  
  // Check if the network we're connected to is in the available networks list
  const connectedNetworkExists = availableNetworks.some(network => network.ssid === networkName);
  
  // If not, add it (this ensures our connected network shows in the available list)
  if (!connectedNetworkExists && networkName) {
    availableNetworks.unshift({
      id: availableNetworks.length + 1,
      ssid: networkName,
      signal: -50, // Strong signal since we're connected to it
      security: 'WPA2'
    });
  }
  
  return {
    networkName: networkName,
    localIp: '192.168.1.2',
    publicIp: realNetworkInfo.publicIp || '203.0.113.1',
    gatewayIp: realNetworkInfo.gatewayIp || '192.168.1.1',
    signalStrength: signalStrengthDb > -60 ? 'Good' : signalStrengthDb > -70 ? 'Fair' : 'Poor',
    signalStrengthDb: `${signalStrengthDb} dBm`,
    networkType: realNetworkInfo.networkType || '802.11ac (5GHz)',
    macAddress: '00:1B:44:11:3A:B7',
    dnsServer: '8.8.8.8, 8.8.4.4',
    connectedDevices: generateConnectedDevices(connectedDeviceCount),
    lastUpdated: new Date(),
    isOnline: isCurrentlyOnline,
    connectionSpeed: {
      download: downloadSpeed,
      upload: uploadSpeed,
      latency: latency
    },
    dataUsage: {
      download: downloadData,
      upload: uploadData,
      total: downloadData + uploadData
    },
    connectionHistory: history,
    availableNetworks: availableNetworks
  };
};
