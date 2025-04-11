
import { fetchRealNetworkInfo } from './realNetworkInfo';
import { generateConnectedDevices, getConnectedDeviceStatus } from './connectedDevices';
import { getAvailableNetworks } from './availableNetworks';
import { NetworkStatus } from './types';
import { toast } from 'sonner';

export const generateNetworkStatus = async (previousStatus: NetworkStatus | null): Promise<NetworkStatus> => {
  console.log("Generating network status, previous status:", previousStatus?.networkName);
  
  // Try to get real network information where possible
  const realNetworkInfo = await fetchRealNetworkInfo();
  console.log("Real network info:", realNetworkInfo);
  
  // Get device connection status to show real-time connected devices
  const connectedDevices = getConnectedDeviceStatus();
  
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
  const isCurrentlyOnline = realNetworkInfo.isOnline !== undefined ? realNetworkInfo.isOnline : navigator.onLine;
  console.log("Is currently online:", isCurrentlyOnline);
  
  // Add connection event if status changed
  if (previousStatus?.isOnline !== isCurrentlyOnline) {
    history.push({
      timestamp: new Date(),
      status: isCurrentlyOnline ? 'connected' : 'disconnected'
    });
  }
  
  // Generate available networks with the real one included
  let availableNetworks = getAvailableNetworks();
  
  // Determine the best network name to use
  // Priority order: 
  // 1. Browser detected network name
  // 2. Manually connected network name from user action
  // 3. Last connected network if we're online
  const browserDetectedNetworkName = realNetworkInfo.networkName;
  const storedNetworkName = localStorage.getItem('connected_network_name');
  const lastConnectedNetwork = localStorage.getItem('last_connected_network');
  
  // Log all possible network name sources for debugging
  console.log("Network name sources:", {
    "Browser detected": browserDetectedNetworkName,
    "Manually connected": storedNetworkName,
    "Last connected": lastConnectedNetwork
  });
  
  // Select the most accurate network name available
  let networkName = browserDetectedNetworkName || storedNetworkName;
  
  // Store browser detection for future reference
  if (browserDetectedNetworkName) {
    localStorage.setItem('current_browser_network', browserDetectedNetworkName);
  }
  
  // If online but no network name, use last connected
  if (isCurrentlyOnline && !networkName && lastConnectedNetwork) {
    networkName = lastConnectedNetwork;
    console.log("Using last connected network:", networkName);
  } 
  // If offline, clear network name
  else if (!isCurrentlyOnline) {
    networkName = undefined;
    console.log("Device offline, clearing network name");
  }
  
  console.log("Selected final network name:", networkName);
  
  // Check if current network exists in available networks and ensure it's prioritized
  const currentNetworkInList = availableNetworks.some(network => network.ssid === networkName);
  
  // If current network not in list, add it with strong signal
  if (!currentNetworkInList && networkName && isCurrentlyOnline) {
    console.log("Adding current network to available list:", networkName);
    availableNetworks.unshift({
      id: availableNetworks.length + 1,
      ssid: networkName,
      signal: -45, // Strong signal
      security: 'WPA2'
    });
  }
  
  // Reorder to ensure current network is at the top
  if (networkName && isCurrentlyOnline) {
    const networkIndex = availableNetworks.findIndex(n => n.ssid === networkName);
    if (networkIndex > 0) {
      const network = availableNetworks[networkIndex];
      availableNetworks.splice(networkIndex, 1);
      availableNetworks.unshift(network);
    }
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
    connectedDevices: connectedDevices.length > 0 ? connectedDevices : generateConnectedDevices(),
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
