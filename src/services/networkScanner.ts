
import { toast } from 'sonner';
import { ConnectedDevice } from '../hooks/network/connectedDevices';

const LOCAL_SCANNER_URL = 'http://localhost:3001'; // Local network scanner server

// Fetch real connected devices from the local network scanner
export const fetchRealDevices = async (): Promise<ConnectedDevice[]> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/devices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Network scanner not available');
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
export const isScannerAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/status`);
    return response.ok;
  } catch {
    return false;
  }
};

// Scan the network for devices
export const scanNetwork = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/scan`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to initiate network scan');
    }
    
    toast.success('Network scan initiated');
    return true;
  } catch (error) {
    console.error('Error scanning network:', error);
    toast.error('Failed to initiate network scan');
    return false;
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

// Configure scanner settings
export const configureScannerSettings = async (settings: {
  scanInterval?: number;
  scanDepth?: 'quick' | 'thorough';
  excludedIpRanges?: string[];
}): Promise<boolean> => {
  try {
    const response = await fetch(`${LOCAL_SCANNER_URL}/configure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update scanner settings');
    }
    
    toast.success('Scanner settings updated');
    return true;
  } catch (error) {
    console.error('Error configuring scanner:', error);
    toast.error('Failed to configure scanner');
    return false;
  }
};
