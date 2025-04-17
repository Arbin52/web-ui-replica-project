
import { toast } from 'sonner';
import { ConnectedDevice } from '../hooks/network/connectedDevices';

// Local network scanner server URL - configurable via environment variable or default to localhost
const LOCAL_SCANNER_URL = import.meta.env.VITE_SCANNER_URL || 'http://localhost:3001';

// Fetch real connected devices from the local network scanner
export const fetchRealDevices = async (): Promise<ConnectedDevice[]> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/devices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`Network scanner returned ${response.status}: ${response.statusText}`);
    }

    const devices = await response.json();
    return devices;
  } catch (error) {
    console.error('Error fetching real devices:', error);
    toast.error('Could not connect to network scanner');
    return []; // Fallback to empty array
  }
};

// Function to check if the scanner service is available
export const isScannerAvailable = async (): Promise<{
  available: boolean;
  pythonAvailable?: boolean;
  version?: string;
}> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/status`, {
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    
    if (!response.ok) {
      return { available: false };
    }
    
    const data = await response.json();
    return { 
      available: true,
      version: data.version
    };
  } catch {
    return { available: false };
  }
};

// Get device details by IP address
export const getDeviceDetails = async (ipAddress: string): Promise<ConnectedDevice | null> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/device/${ipAddress}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch device details');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for device ${ipAddress}:`, error);
    return null;
  }
};

// Scan the network for devices
export const scanNetwork = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/devices`);
    
    if (!response.ok) {
      throw new Error('Failed to scan network');
    }
    
    toast.success('Network scan completed');
    return true;
  } catch (error) {
    console.error('Error scanning network:', error);
    toast.error('Failed to scan network');
    return false;
  }
};
