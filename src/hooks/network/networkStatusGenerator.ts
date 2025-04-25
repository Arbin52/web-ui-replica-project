
import { fetchRealNetworkInfo } from './realNetworkInfo';
import { generateConnectedDevices, getConnectedDeviceStatus } from './connectedDevices';
import { getAvailableNetworks } from './availableNetworks';
import { getConnectionHistory } from './networkHistoryUtils';
import { NetworkStatus } from './types';

// Store previous values with global variables for smoother transitions
let previousDownloadSpeed = 0;
let previousUploadSpeed = 0;
let previousLatency = 0;

// Adding more global variables to track long-term average values
// This helps create more stable numbers that don't fluctuate wildly
let downloadSpeedHistory: number[] = [];
let uploadSpeedHistory: number[] = [];
let latencyHistory: number[] = [];

// Function to calculate moving average with decay factor
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
  console.log("Generating network status");
  
  // Try to get real network information
  const realNetworkInfo = await fetchRealNetworkInfo();
  console.log("Real network info:", realNetworkInfo);
  
  // Get actual browser network information if available
  const connection = (navigator as any).connection;
  const networkType = connection?.type || 'unknown';
  const effectiveType = connection?.effectiveType || '4g';
  
  // CRITICAL: Always trust the browser's online status
  const isCurrentlyOnline = navigator.onLine;
  console.log("Browser reports online status:", isCurrentlyOnline);
  
  // ALWAYS get devices regardless of online status
  const connectedDevices = getConnectedDeviceStatus();
  console.log("Connected devices:", connectedDevices.length);
  
  // Generate more dynamic speed values based on connection type
  let baseDownloadSpeed = effectiveType === '4g' ? 100 : 
                         effectiveType === '3g' ? 50 : 
                         effectiveType === '2g' ? 20 : 75;
                         
  let baseUploadSpeed = baseDownloadSpeed * 0.3;
  
  // Add some random variation to make it look live
  const variation = 0.2; // 20% variation
  const randomFactor = 1 + (Math.random() * variation * 2 - variation);
  
  let downloadSpeed = Math.round(baseDownloadSpeed * randomFactor * 10) / 10;
  let uploadSpeed = Math.round(baseUploadSpeed * randomFactor * 10) / 10;
  let latency = Math.round((Math.random() * 10 + 5) * 10) / 10;
  
  // Use moving average for smoother transitions if we have previous values
  if (previousStatus) {
    downloadSpeed = calculateMovingAverage(downloadSpeedHistory, downloadSpeed);
    uploadSpeed = calculateMovingAverage(uploadSpeedHistory, uploadSpeed);
    latency = calculateMovingAverage(latencyHistory, latency);
  }
  
  // Update histories
  downloadSpeedHistory.push(downloadSpeed);
  uploadSpeedHistory.push(uploadSpeed);
  latencyHistory.push(latency);
  
  // Maintain maximum history length
  if (downloadSpeedHistory.length > 5) downloadSpeedHistory.shift();
  if (uploadSpeedHistory.length > 5) uploadSpeedHistory.shift();
  if (latencyHistory.length > 5) latencyHistory.shift();
  
  // Try to get the actual network name from various sources
  const networkName = realNetworkInfo.networkName || 
                     localStorage.getItem('user_provided_network_name') ||
                     localStorage.getItem('current_browser_network') ||
                     'Unknown Network';
                     
  // Generate more realistic data usage values that increase over time
  const lastUpdateTime = previousStatus?.lastUpdated || new Date();
  const timeDiff = (new Date().getTime() - lastUpdateTime.getTime()) / 1000; // in seconds
  
  const baseDownloadData = previousStatus?.dataUsage?.download || 1500;
  const baseUploadData = previousStatus?.dataUsage?.upload || 500;
  
  // Simulate data usage increase based on time passed
  const downloadIncrease = (Math.random() * 50 + 10) * timeDiff;
  const uploadIncrease = (Math.random() * 20 + 5) * timeDiff;
  
  const downloadData = Math.round(baseDownloadData + downloadIncrease);
  const uploadData = Math.round(baseUploadData + uploadIncrease);

  // Get connection history and available networks
  const connectionHistory = realNetworkInfo.connectionHistory || getConnectionHistory();
  const availableNetworks = getAvailableNetworks();
  
  // Generate realistic signal strength
  const signalStrengthDb = -(Math.floor(Math.random() * 30) + 40);

  // Use fallback values for all potentially missing properties
  const localIp = realNetworkInfo.localIp || '192.168.1.2';
  const publicIp = realNetworkInfo.publicIp || '203.0.113.1';
  const gatewayIp = realNetworkInfo.gatewayIp || '192.168.1.1';
  const macAddress = realNetworkInfo.macAddress || '00:1B:44:11:3A:B7';
  
  return {
    networkName,
    localIp,
    publicIp,
    gatewayIp,
    signalStrength: signalStrengthDb > -60 ? 'Good' : signalStrengthDb > -70 ? 'Fair' : 'Poor',
    signalStrengthDb: `${signalStrengthDb} dBm`,
    networkType: realNetworkInfo.networkType || `${networkType} (${effectiveType})`,
    macAddress,
    dnsServer: '8.8.8.8, 8.8.4.4',
    connectedDevices,
    lastUpdated: new Date(),
    isOnline: isCurrentlyOnline,
    connectionSpeed: {
      download: downloadSpeed,
      upload: uploadSpeed,
      latency
    },
    dataUsage: {
      download: downloadData,
      upload: uploadData,
      total: downloadData + uploadData
    },
    connectionHistory,
    availableNetworks
  };
};
