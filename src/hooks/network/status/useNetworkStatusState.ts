
import { useState } from 'react';
import { NetworkStatus } from '../types';

export const useNetworkStatusState = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(300000); // Default to 5 minutes
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  return {
    networkStatus,
    setNetworkStatus,
    isLoading,
    setIsLoading,
    error,
    setError,
    isLiveUpdating,
    setIsLiveUpdating,
    updateInterval,
    setUpdateInterval,
    autoConnectAttempted,
    setAutoConnectAttempted
  };
};
