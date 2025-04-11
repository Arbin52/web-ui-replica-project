
import React from 'react';
import { Router } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DeviceList } from '@/components/devices/DeviceList';
import { NetworkStatus } from '@/hooks/network/types';

interface ConnectedDevicesProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const ConnectedDevices: React.FC<ConnectedDevicesProps> = ({ networkStatus, isLoading }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Router size={18} />
          <CardTitle className="text-lg">Connected Devices ({isLoading ? '...' : networkStatus?.connectedDevices.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <DeviceList filter="all" className="border-0 divide-y divide-gray-100" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
