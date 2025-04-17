
import { useState, useEffect, useCallback, useRef } from 'react';
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
import { debounce, scheduleIdleTask } from '@/utils/performance';

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
  
  // Track mount state to avoid state updates after unmount
  const isMounted = useRef(true);
  // Prevent concurrent operations
  const isOperationInProgress = useRef(false);

  // Check if we're running in a deployed environment (not localhost)
  const isDeployed = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check if scanner is available when component mounts
  useEffect(() => {
    // Only check for scanner if not in deployed mode
    if (!isDeployed) {
      checkScannerAvailability();
    } else {
      // We're in deployed mode, so we immediately know scanner isn't available
      setHasScanner(false);
      setIsLoading(false);
      console.log('Running in deployed mode - network scanner not available');
    }
  }, [isDeployed]);

  // Check if local scanner is available - with debouncing to prevent UI freeze
  const checkScannerAvailability = useCallback(debounce(async () => {
    // If we're in deployed mode, scanner is definitely not available
    if (isDeployed) {
      setHasScanner(false);
      setIsLoading(false);
      return;
    }

    if (isOperationInProgress.current) return;
    isOperationInProgress.current = true;
    
    setIsLoading(true);
    try {
      const { available, pythonAvailable, version } = await isScannerAvailable();
      
      if (!isMounted.current) return;
      
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
            // Use idle callback to get scanner status in background
            scheduleIdleTask(async () => {
              try {
                // Get detailed scanner status with Python info
                const status = await getScannerStatus();
                if (isMounted.current) {
                  setScannerStatus(status);
                }
                console.log('Scanner status:', status);
              } catch (e) {
                console.error('Failed to get scanner status:', e);
              }
            });
          } catch (e) {
            console.error('Error scheduling scanner status check:', e);
          }
        } else {
          toast.success('Connected to network scanner (basic mode)');
        }
        await refreshDevices();
      }
    } catch (error) {
      console.error('Error checking scanner availability:', error);
      if (isMounted.current) {
        setConnectionError('Failed to connect to scanner service');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      isOperationInProgress.current = false;
    }
  }, 300), [isDeployed, clearConnectionError, setConnectionError]);

  // Refresh the list of connected devices - with debouncing
  const refreshDevices = useCallback(debounce(async () => {
    if (!hasScanner) {
      if (!isDeployed) {
        toast.error('Network scanner not available');
      }
      return;
    }
    
    if (isOperationInProgress.current) return;
    isOperationInProgress.current = true;
    
    setIsLoading(true);
    try {
      const realDevices = await fetchRealDevices();
      
      if (isMounted.current) {
        setDevices(realDevices);
        clearConnectionError();
      }
    } catch (error) {
      console.error('Error refreshing devices:', error);
      if (isMounted.current) {
        toast.error('Failed to refresh device list');
        setConnectionError('Failed to fetch device list');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      isOperationInProgress.current = false;
    }
  }, 300), [hasScanner, clearConnectionError, setConnectionError, isDeployed]);

  // Initiate a network scan - with debouncing
  const startNetworkScan = useCallback(debounce(async () => {
    if (!hasScanner) {
      if (!isDeployed) {
        toast.error('Network scanner not available');
      }
      return;
    }
    
    if (isOperationInProgress.current) return;
    isOperationInProgress.current = true;
    
    setIsScanning(true);
    try {
      await scanNetwork();
      
      // Wait 2 seconds then refresh devices to give scan time to complete
      setTimeout(() => {
        if (isMounted.current) {
          refreshDevices();
          setIsScanning(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error starting scan:', error);
      if (isMounted.current) {
        setIsScanning(false);
      }
    } finally {
      isOperationInProgress.current = false;
    }
  }, 300), [hasScanner, refreshDevices, isDeployed]);

  // Get detailed information about a specific device - with debouncing
  const getDeviceInfo = useCallback(debounce(async (ipAddress: string) => {
    if (!hasScanner) return null;
    
    try {
      const deviceInfo = await getDeviceDetails(ipAddress);
      if (deviceInfo && isMounted.current) {
        setSelectedDevice(deviceInfo);
      }
      return deviceInfo;
    } catch (error) {
      console.error(`Error getting device info for ${ipAddress}:`, error);
      return null;
    }
  }, 300), [hasScanner]);

  // Update scanner settings - with debouncing
  const updateScannerSettings = useCallback(debounce(async (settings: Partial<ScannerSettings>) => {
    if (!hasScanner) return false;
    
    try {
      const success = await configureScannerSettings(settings);
      if (success && isMounted.current) {
        setScannerSettings(prev => ({ ...prev, ...settings }));
      }
      return success;
    } catch (error) {
      console.error('Error updating scanner settings:', error);
      return false;
    }
  }, 300), [hasScanner]);

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
    isDeployed,
    refreshDevices,
    startNetworkScan,
    getDeviceInfo,
    updateScannerSettings,
    checkScannerAvailability,
    setSelectedDevice
  };
};
