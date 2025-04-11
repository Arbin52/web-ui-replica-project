
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { generateNetworkStatus } from './networkStatusGenerator';
import { NetworkStatus } from './types';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000); // 5 seconds by default
  
  const fetchNetworkStatus = useCallback(async () => {
    // In a real application, this would make API calls to get actual network data
    try {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate network status data with real information where possible
      const data = await generateNetworkStatus(networkStatus);
      
      setNetworkStatus(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching network status:', err);
      setError('Failed to fetch network status. Please try again.');
      toast.error('Failed to fetch network status');
    } finally {
      setIsLoading(false);
    }
  }, [networkStatus]);

  useEffect(() => {
    fetchNetworkStatus();
    
    // Set up polling for real-time updates if live updating is enabled
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isLiveUpdating) {
      intervalId = setInterval(() => {
        fetchNetworkStatus();
      }, updateInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchNetworkStatus, isLiveUpdating, updateInterval]);

  const refreshNetworkStatus = () => {
    setIsLoading(true);
    toast.info('Refreshing network status...');
    fetchNetworkStatus();
  };

  const toggleLiveUpdates = () => {
    setIsLiveUpdating(prev => !prev);
    toast.info(isLiveUpdating ? 'Live updates paused' : 'Live updates resumed');
  };

  const setRefreshRate = (ms: number) => {
    setUpdateInterval(ms);
    toast.info(`Update interval set to ${ms/1000} seconds`);
  };

  return {
    networkStatus,
    isLoading,
    error,
    refreshNetworkStatus,
    isLiveUpdating,
    toggleLiveUpdates,
    updateInterval,
    setRefreshRate
  };
};
