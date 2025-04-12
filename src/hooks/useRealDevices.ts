
import { useState, useEffect, useCallback } from 'react';
import { ConnectedDevice } from './network/connectedDevices';
import { 
  fetchRealDevices, 
  isScannerAvailable, 
  scanNetwork, 
  getDeviceDetails,
  configureScannerSettings,
  getScannerStatus
} from '../services/networkScanner';
import { toast } from 'sonner';
import { useConnectionErrorHandling } from './network/status/useConnectionErrorHandling';

interface ScannerSettings {
  scanInterval: number;
  scanDepth: 'quick' | 'thorough';
  excludedIpRanges: string[];
}

interface ScannerStatus {
  os?: string;
  pythonVersion?: string;
  modules?: {
    scapy: boolean;
    nmap: boolean;
    netifaces: boolean;
    psutil: boolean;
  };
  defaultGateway?: string;
  networkRange?: string;
  pythonAvailable: boolean;
}

export const useRealDevices = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScanner, setHasScanner] = useState(false);
  const [isPythonAvailable, setIsPythonAvailable] = useState(false);
  const [scannerVersion, setScannerVersion] = useState<string | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<ConnectedDevice | null>(null);
  const [scannerSettings, setScannerSettings] = useState<ScannerSettings>({
    scanInterval: 60000, // 1 minute default
    scanDepth: 'quick',
    excludedIpRanges: []
  });
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus | null>(null);
  
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
      const { available, pythonAvailable, version } = await isScannerAvailable();
      setHasScanner(available);
      setIsPythonAvailable(pythonAvailable || false);
      setScannerVersion(version);
      clearConnectionError();
      
      if (!available) {
        console.log('Network scanner not available - using mock data');
        toast.error('Network scanner not available. Please start the local scanner service.');
      } else {
        if (pythonAvailable) {
          toast.success('Connected to network scanner with Python support');
          
          try {
            // Get detailed scanner status with Python info
            const status = await getScannerStatus();
            setScannerStatus(status);
            console.log('Scanner status:', status);
          } catch (e) {
            console.error('Failed to get scanner status:', e);
          }
        } else {
          toast.success('Connected to network scanner (basic mode)');
        }
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
    if (!hasScanner) {
      toast.error('Network scanner not available');
      return;
    }
    
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
    isPythonAvailable,
    scannerVersion,
    isScanning,
    scannerSettings,
    scannerStatus,
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
