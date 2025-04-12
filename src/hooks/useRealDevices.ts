
import { useState, useEffect, useCallback } from 'react';
import { ConnectedDevice } from './network/connectedDevices';
import { 
  fetchRealDevices, 
  isScannerAvailable, 
  scanNetwork, 
  getDeviceDetails,
  configureScannerSettings
} from '../services/networkScanner';
import { toast } from 'sonner';
import { useConnectionErrorHandling } from './network/status/useConnectionErrorHandling';

interface ScannerSettings {
  scanInterval: number;
  scanDepth: 'quick' | 'thorough';
  excludedIpRanges: string[];
}

export const useRealDevices = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScanner, setHasScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<ConnectedDevice | null>(null);
  const [scannerSettings, setScannerSettings] = useState<ScannerSettings>({
    scanInterval: 60000, // 1 minute default
    scanDepth: 'quick',
    excludedIpRanges: []
  });
  const { connectionError, setConnectionError, clearConnectionError } = useConnectionErrorHandling();

  // Check if scanner is available when component mounts
  useEffect(() => {
    checkScannerAvailability();
    
    // Cleanup function to handle component unmount
    return () => {
      // Any cleanup needed
    };
  }, []);

  // Check if local scanner is available
  const checkScannerAvailability = async () => {
    setIsLoading(true);
    try {
      const available = await isScannerAvailable();
      setHasScanner(available);
      clearConnectionError();
      
      if (!available) {
        console.log('Network scanner not available - using mock data');
        toast.error('Network scanner not available. Please start the local scanner service.');
      } else {
        toast.success('Connected to network scanner');
        await refreshDevices();
      }
    } catch (error) {
      console.error('Error checking scanner availability:', error);
      setConnectionError('Failed to connect to scanner service');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh the list of connected devices
  const refreshDevices = useCallback(async () => {
    if (!hasScanner) {
      toast.error('Network scanner not available');
      return;
    }
    
    setIsLoading(true);
    try {
      const realDevices = await fetchRealDevices();
      setDevices(realDevices);
      clearConnectionError();
    } catch (error) {
      console.error('Error refreshing devices:', error);
      toast.error('Failed to refresh device list');
      setConnectionError('Failed to fetch device list');
    } finally {
      setIsLoading(false);
    }
  }, [hasScanner, clearConnectionError, setConnectionError]);

  // Initiate a network scan
  const startNetworkScan = async () => {
    if (!hasScanner) return;
    
    setIsScanning(true);
    try {
      await scanNetwork();
      // Wait 2 seconds then refresh devices to give scan time to complete
      setTimeout(() => {
        refreshDevices();
        setIsScanning(false);
      }, 2000);
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
    }
  };

  // Get detailed information about a specific device
  const getDeviceInfo = async (ipAddress: string) => {
    if (!hasScanner) return null;
    
    try {
      const deviceInfo = await getDeviceDetails(ipAddress);
      if (deviceInfo) {
        setSelectedDevice(deviceInfo);
      }
      return deviceInfo;
    } catch (error) {
      console.error(`Error getting device info for ${ipAddress}:`, error);
      return null;
    }
  };

  // Update scanner settings
  const updateScannerSettings = async (settings: Partial<ScannerSettings>) => {
    if (!hasScanner) return false;
    
    try {
      const success = await configureScannerSettings(settings);
      if (success) {
        setScannerSettings(prev => ({ ...prev, ...settings }));
      }
      return success;
    } catch (error) {
      console.error('Error updating scanner settings:', error);
      return false;
    }
  };

  return {
    devices,
    isLoading,
    hasScanner,
    isScanning,
    scannerSettings,
    selectedDevice,
    connectionError,
    refreshDevices,
    startNetworkScan,
    getDeviceInfo,
    updateScannerSettings,
    checkScannerAvailability,
    setSelectedDevice
  };
};
