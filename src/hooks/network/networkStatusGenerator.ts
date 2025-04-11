
import { fetchRealNetworkInfo } from './realNetworkInfo';
import { generateConnectedDevices, getConnectedDeviceStatus } from './connectedDevices';
import { getAvailableNetworks } from './availableNetworks';
import { getConnectionHistory } from './networkHistoryUtils';
import { NetworkStatus } from './types';
import { toast } from 'sonner';

let previousDownloadSpeed = 0;
let previousUploadSpeed = 0;
let previousLatency = 0;

export const generateNetworkStatus = async (previousStatus: NetworkStatus | null): Promise<NetworkStatus> => {
  console.log("Generating network status, previous status:", previousStatus?.networkName);
  
  // Try to get real network information where possible
  const realNetworkInfo = await fetchRealNetworkInfo();
  console.log("Real network info:", realNetworkInfo);
  
  // Get device connection status to show real-time connected devices
  const connectedDevices = getConnectedDeviceStatus();
  
  // Generate realistic dynamic values with smoothing to prevent rapid changes
  const signalStrengthDb = -(Math.floor(Math.random() * 30) + 40); // Stronger signal than before
  
  // Smooth the network speed values to prevent rapid changes
  let downloadSpeed, uploadSpeed, latency;
  
  if (previousStatus) {
    // Apply smoothing - only change by up to 5% of current value
    const maxDownloadChange = previousDownloadSpeed * 0.05;
    downloadSpeed = previousDownloadSpeed + (Math.random() * maxDownloadChange * 2 - maxDownloadChange);
    downloadSpeed = Math.floor(downloadSpeed * 10) / 10; // Round to 1 decimal place
    
    const maxUploadChange = previousUploadSpeed * 0.05;
    uploadSpeed = previousUploadSpeed + (Math.random() * maxUploadChange * 2 - maxUploadChange);
    uploadSpeed = Math.floor(uploadSpeed * 10) / 10; // Round to 1 decimal place
    
    const maxLatencyChange = Math.max(1, previousLatency * 0.05);
    latency = previousLatency + (Math.random() * maxLatencyChange * 2 - maxLatencyChange);
    latency = Math.floor(latency * 10) / 10; // Round to 1 decimal place
  } else {
    // Initial values
    downloadSpeed = Math.floor(Math.random() * 30) + 90; // Higher speed for 5G network
    uploadSpeed = Math.floor(Math.random() * 10) + 20; // Higher upload for 5G
    latency = Math.floor(Math.random() * 10) + 3; // Lower latency for 5G
  }
  
  // Update previous values for next time
  previousDownloadSpeed = downloadSpeed;
  previousUploadSpeed = uploadSpeed;
  previousLatency = latency;
  
  // Data usage simulated values
  const downloadData = Math.floor(Math.random() * 500) + 1000; // Between 1000-1500 MB
  const uploadData = Math.floor(Math.random() * 200) + 300; // Between 300-500 MB

  // Get connection history from storage
  const connectionHistory = realNetworkInfo.connectionHistory || getConnectionHistory();
  
  // Use real online status if available, otherwise simulate occasional disconnection
  const isCurrentlyOnline = realNetworkInfo.isOnline !== undefined ? realNetworkInfo.isOnline : navigator.onLine;
  console.log("Is currently online:", isCurrentlyOnline);
  
  // Generate available networks with the real one included
  let availableNetworks = getAvailableNetworks();
  
  // Determine the best network name to use based on multiple sources
  const browserDetectedNetworkName = realNetworkInfo.networkName;
  const storedNetworkName = localStorage.getItem('connected_network_name');
  const lastConnectedNetwork = localStorage.getItem('last_connected_network');
  const userProvidedNetwork = localStorage.getItem('user_provided_network_name');
  const webrtcDetectedNetwork = localStorage.getItem('webrtc_detected_ssid');
  
  // Log all possible network name sources for debugging
  console.log("Network name sources:", {
    "Browser detected": browserDetectedNetworkName,
    "Manually connected": storedNetworkName,
    "Last connected": lastConnectedNetwork,
    "User provided": userProvidedNetwork,
    "WebRTC detected": webrtcDetectedNetwork
  });
  
  // Select the most accurate network name available - prioritize user input or direct detection
  let networkName = userProvidedNetwork || webrtcDetectedNetwork || browserDetectedNetworkName;
  
  // If browser detection didn't work, fall back to stored values
  if (!networkName && isCurrentlyOnline) {
    networkName = storedNetworkName || lastConnectedNetwork;
    console.log("Using stored network name:", networkName);
  }
  
  // If online but no network name detected, try OS-level detection
  if (isCurrentlyOnline && !networkName) {
    // Try to get the OS-level network name
    try {
      if ((navigator as any).connection && (navigator as any).connection.type === 'wifi') {
        // We know we're on WiFi but don't know the name
        networkName = "Unknown WiFi Network";
        console.log("WiFi connection detected, using generic name:", networkName);
      } 
    } catch (e) {
      console.log("Error detecting connection type:", e);
    }
  }
  
  // If offline, clear network name
  if (!isCurrentlyOnline) {
    networkName = undefined;
    console.log("Device offline, clearing network name");
  }
  
  console.log("Selected final network name:", networkName);
  
  // Check if current network exists in available networks and ensure it's prioritized
  if (networkName && isCurrentlyOnline) {
    const currentNetworkInList = availableNetworks.some(network => network.ssid === networkName);
    
    // If current network not in list, add it with strong signal
    if (!currentNetworkInList && networkName !== 'Unknown WiFi Network' && networkName !== 'Unknown Network') {
      console.log("Adding current network to available list:", networkName);
      availableNetworks.unshift({
        id: availableNetworks.length + 1,
        ssid: networkName,
        signal: -45, // Strong signal
        security: 'WPA2'
      });
    }
    
    // Reorder to ensure current network is at the top
    const networkIndex = availableNetworks.findIndex(n => n.ssid === networkName);
    if (networkIndex > 0) {
      const network = availableNetworks[networkIndex];
      availableNetworks.splice(networkIndex, 1);
      availableNetworks.unshift(network);
    }
  }
  
  return {
    networkName: networkName || undefined,
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
    connectionHistory: connectionHistory,
    availableNetworks: availableNetworks
  };
};
