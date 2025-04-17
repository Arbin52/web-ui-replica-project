
import { fetchRealNetworkInfo } from './realNetworkInfo';
import { generateConnectedDevices, getConnectedDeviceStatus } from './connectedDevices';
import { getAvailableNetworks } from './availableNetworks';
import { getConnectionHistory } from './networkHistoryUtils';
import { NetworkStatus } from './types';

// Store previous values with global variables for smoother transitions
// These values will persist between function calls
let previousDownloadSpeed = 0;
let previousUploadSpeed = 0;
let previousLatency = 0;

// Adding more global variables to track long-term average values
// This helps create more stable numbers that don't fluctuate wildly
let downloadSpeedHistory: number[] = [];
let uploadSpeedHistory: number[] = [];
let latencyHistory: number[] = [];

// Function to calculate moving average with decay factor
// Newer values have more weight than older values
const calculateMovingAverage = (history: number[], newValue: number, maxHistoryLength: number = 5) => {
  // Add the new value to history
  history.push(newValue);
  
  // Maintain maximum history length
  if (history.length > maxHistoryLength) {
    history.shift();
  }
  
  // Calculate weighted average (newer values have more weight)
  let weightSum = 0;
  let valueSum = 0;
  
  for (let i = 0; i < history.length; i++) {
    // Weight increases with index (newer values)
    const weight = i + 1;
    weightSum += weight;
    valueSum += history[i] * weight;
  }
  
  return valueSum / weightSum;
};

export const generateNetworkStatus = async (previousStatus: NetworkStatus | null): Promise<NetworkStatus> => {
  console.log("Generating network status, previous status:", previousStatus?.networkName);
  
  // Try to get real network information where possible
  const realNetworkInfo = await fetchRealNetworkInfo();
  console.log("Real network info:", realNetworkInfo);
  
  // CRITICAL: Force trust the browser's online status
  // This is key to preventing the "Not Connected" issue
  const isCurrentlyOnline = navigator.onLine;
  console.log("Browser reports online status:", isCurrentlyOnline);
  
  // Get device connection status to show real-time connected devices
  const connectedDevices = getConnectedDeviceStatus();
  
  // Generate realistic dynamic values with smoothing to prevent rapid changes
  const signalStrengthDb = -(Math.floor(Math.random() * 30) + 40);
  
  // Smooth the network speed values to prevent rapid changes
  let downloadSpeed, uploadSpeed, latency;
  
  if (previousStatus) {
    // Apply advanced smoothing with smaller maximum changes
    // Maximum change reduced to 1% of current value for more stability
    const maxDownloadChange = previousDownloadSpeed * 0.01;
    const randomDownloadChange = (Math.random() * maxDownloadChange * 2 - maxDownloadChange);
    const newDownloadValue = previousDownloadSpeed + randomDownloadChange;
    
    // Use moving average for super-smooth values
    downloadSpeed = calculateMovingAverage(downloadSpeedHistory, newDownloadValue);
    downloadSpeed = Math.round(downloadSpeed * 10) / 10; // Round to 1 decimal place
    
    const maxUploadChange = previousUploadSpeed * 0.01;
    const randomUploadChange = (Math.random() * maxUploadChange * 2 - maxUploadChange);
    const newUploadValue = previousUploadSpeed + randomUploadChange;
    
    uploadSpeed = calculateMovingAverage(uploadSpeedHistory, newUploadValue);
    uploadSpeed = Math.round(uploadSpeed * 10) / 10; // Round to 1 decimal place
    
    const maxLatencyChange = Math.max(0.5, previousLatency * 0.01);
    const randomLatencyChange = (Math.random() * maxLatencyChange * 2 - maxLatencyChange);
    const newLatencyValue = previousLatency + randomLatencyChange;
    
    latency = calculateMovingAverage(latencyHistory, newLatencyValue);
    latency = Math.round(latency * 10) / 10; // Round to 1 decimal place
  } else {
    // Initial values
    downloadSpeed = Math.floor(Math.random() * 30) + 90; // Higher speed for 5G network
    uploadSpeed = Math.floor(Math.random() * 10) + 20; // Higher upload for 5G
    latency = Math.floor(Math.random() * 10) + 3; // Lower latency for 5G
    
    // Initialize histories
    downloadSpeedHistory = [downloadSpeed];
    uploadSpeedHistory = [uploadSpeed];
    latencyHistory = [latency];
  }
  
  // Update previous values for next time
  previousDownloadSpeed = downloadSpeed;
  previousUploadSpeed = uploadSpeed;
  previousLatency = latency;
  
  // Data usage simulated values - with stable generation
  const downloadData = previousStatus?.dataUsage?.download || Math.floor(Math.random() * 500) + 1000;
  const uploadData = previousStatus?.dataUsage?.upload || Math.floor(Math.random() * 200) + 300;

  // Get connection history from storage
  const connectionHistory = realNetworkInfo.connectionHistory || getConnectionHistory();
  
  // Use browser's online status and network name from realNetworkInfo
  let networkName = realNetworkInfo.networkName;
  
  // If online but no network name, use a default
  if (isCurrentlyOnline && !networkName) {
    networkName = "Connected Network";
    console.log("Online without network name, using default name");
  }
  
  // If offline, clear network name
  if (!isCurrentlyOnline) {
    networkName = undefined;
    console.log("Browser reports offline, clearing network name");
  }
  
  console.log("Final network status - Online:", isCurrentlyOnline, "Network:", networkName);
  
  // Generate available networks
  const availableNetworks = getAvailableNetworks();
  
  return {
    networkName,
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
    isOnline: isCurrentlyOnline, // Most important: Use browser's online status
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
