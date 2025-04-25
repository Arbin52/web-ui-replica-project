
import { fetchRealNetworkInfo } from './realNetworkInfo';
import { generateConnectedDevices, getConnectedDeviceStatus } from './connectedDevices';
import { getAvailableNetworks } from './availableNetworks';
import { getConnectionHistory } from './networkHistoryUtils';
import { NetworkStatus } from './types';

// Store previous values with global variables for smoother transitions
let previousDownloadSpeed = 0;
let previousUploadSpeed = 0;
let previousLatency = 0;
let previousDataDownload = 1500;
let previousDataUpload = 500;

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

// Function to format numbers to a reasonable number of decimals
const formatNumber = (value: number): number => {
  return parseFloat(value.toFixed(2));
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
  let baseDownloadSpeed;
  if (previousStatus && previousStatus.connectionSpeed) {
    // Use previous speeds as base to create smoother transitions
    baseDownloadSpeed = previousStatus.connectionSpeed.download;
  } else {
    baseDownloadSpeed = effectiveType === '4g' ? 100 : 
                         effectiveType === '3g' ? 50 : 
                         effectiveType === '2g' ? 20 : 75;
  }
  
  let baseUploadSpeed = baseDownloadSpeed * 0.3;
  
  // Add very small random variation to make it look live but not jump wildly
  const variation = 0.05; // 5% variation (reduced from 20%)
  const randomFactor = 1 + (Math.random() * variation * 2 - variation);
  
  let downloadSpeed = Math.round(baseDownloadSpeed * randomFactor * 10) / 10;
  let uploadSpeed = Math.round(baseUploadSpeed * randomFactor * 10) / 10;
  let latency = Math.round((previousStatus?.connectionSpeed.latency || 15) + (Math.random() * 2 - 1) * 10) / 10;
  
  // Ensure latency is always positive
  if (latency < 1) latency = 1;
  
  // Use moving average for smoother transitions if we have previous values
  if (previousStatus) {
    downloadSpeed = calculateMovingAverage(downloadSpeedHistory, downloadSpeed);
    uploadSpeed = calculateMovingAverage(uploadSpeedHistory, uploadSpeed);
    latency = calculateMovingAverage(latencyHistory, latency);
  }
  
  // Format numbers to reasonable decimals (max 2 decimals)
  downloadSpeed = formatNumber(downloadSpeed);
  uploadSpeed = formatNumber(uploadSpeed);
  latency = formatNumber(latency);
  
  // Update histories
  downloadSpeedHistory.push(downloadSpeed);
  uploadSpeedHistory.push(uploadSpeed);
  latencyHistory.push(latency);
  
  // Maintain maximum history length
  if (downloadSpeedHistory.length > 5) downloadSpeedHistory.shift();
  if (uploadSpeedHistory.length > 5) uploadSpeedHistory.shift();
  if (latencyHistory.length > 5) latencyHistory.shift();
  
  // Try to get the actual network name from various sources including browser info
  const activeNetworkName = (() => {
    // Try to get the network SSID from browser or OS info
    try {
      // Use real detected network name first
      const detectedName = realNetworkInfo.networkName;
      
      // If we have a real network name from the user's device, use it
      if (detectedName && 
          detectedName !== "Unknown Network" && 
          detectedName !== "Connected Network") {
        return detectedName;
      }
      
      // Try to get network name from browser
      if (window && window.navigator) {
        // Try connection info (Chrome/Android)
        if ((navigator as any).connection?.name) {
          return (navigator as any).connection.name;
        }
        
        // For some browsers/OS, detect Wi-Fi vs cellular
        if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
          return 'iOS Device Network';
        }
        
        if (navigator.userAgent.includes('Android')) {
          return 'Android Device Network';
        }
      }
      
      // Use any stored values
      return localStorage.getItem('user_provided_network_name') ||
             localStorage.getItem('current_browser_network') ||
             (navigator.onLine ? 'Your Network' : 'Not Connected');
    } catch (e) {
      console.error('Error detecting network name:', e);
      return navigator.onLine ? 'Your Network' : 'Not Connected';
    }
  })();
                     
  // Generate more realistic data usage values that increase over time
  const lastUpdateTime = previousStatus?.lastUpdated || new Date(Date.now() - 3000);
  const timeDiff = (new Date().getTime() - lastUpdateTime.getTime()) / 1000; // in seconds
  
  // Start with previous values or defaults
  const baseDownloadData = previousStatus?.dataUsage?.download || previousDataDownload;
  const baseUploadData = previousStatus?.dataUsage?.upload || previousDataUpload;
  
  // Simulate data usage increase based on time passed and current speed
  // This creates a realistic correlation between speed and data usage
  const downloadIncrease = (downloadSpeed / 8) * timeDiff; // Convert Mbps to MB/s
  const uploadIncrease = (uploadSpeed / 8) * timeDiff; // Convert Mbps to MB/s
  
  // Format data usage to max 2 decimal places for more realistic display
  const downloadData = formatNumber(baseDownloadData + downloadIncrease);
  const uploadData = formatNumber(baseUploadData + uploadIncrease);

  // Store current values for next refresh
  previousDataDownload = downloadData;
  previousDataUpload = uploadData;

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
    networkName: activeNetworkName,
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
      total: formatNumber(downloadData + uploadData)
    },
    connectionHistory,
    availableNetworks
  };
};
