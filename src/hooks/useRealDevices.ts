
import { useState, useEffect } from 'react';
import { ConnectedDevice } from './network/connectedDevices';
import { fetchRealDevices, isScannerAvailable } from '../services/networkScanner';
import { toast } from 'sonner';

export const useRealDevices = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScanner, setHasScanner] = useState(false);

  useEffect(() => {
    checkScannerAvailability();
  }, []);

  const checkScannerAvailability = async () => {
    const available = await isScannerAvailable();
    setHasScanner(available);
    
    if (!available) {
      console.log('Network scanner not available - using mock data');
      return;
    }

    await refreshDevices();
  };

  const refreshDevices = async () => {
    if (!hasScanner) return;
    
    setIsLoading(true);
    try {
      const realDevices = await fetchRealDevices();
      setDevices(realDevices);
    } catch (error) {
      console.error('Error refreshing devices:', error);
      toast.error('Failed to refresh device list');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    devices,
    isLoading,
    hasScanner,
    refreshDevices
  };
};
