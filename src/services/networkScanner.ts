
import { toast } from 'sonner';
import { ConnectedDevice } from '../hooks/network/connectedDevices';

const LOCAL_SCANNER_URL = 'http://localhost:3001'; // Your local scanner server

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
