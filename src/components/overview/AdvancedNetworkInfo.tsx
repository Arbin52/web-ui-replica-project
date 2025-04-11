
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { NetworkStatus } from '@/hooks/network/types';

interface AdvancedNetworkInfoProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const AdvancedNetworkInfo: React.FC<AdvancedNetworkInfoProps> = ({ networkStatus, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="info-row">
        <div className="info-label">MAC Address:</div>
        <div className="info-value">{networkStatus?.macAddress}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">DNS Servers:</div>
        <div className="info-value">{networkStatus?.dnsServer}</div>
      </div>
    </>
  );
};
