
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ConnectedDevices } from '../overview/ConnectedDevices';
import { NetworkStatus } from '@/hooks/network/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';
import { useRealDevices } from '@/hooks/useRealDevices';

interface NetworkDevicesProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const NetworkDevices: React.FC<NetworkDevicesProps> = ({
  networkStatus,
  isLoading
}) => {
  // Get current hostname to detect if we're deployed or on localhost
  const isDeployed = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1';

  const { hasScanner } = useRealDevices();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
        <CardDescription>
          Manage devices connected to your network
        </CardDescription>
        
        {isDeployed && !hasScanner ? (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Scanner Unavailable in Deployed Mode</AlertTitle>
            <AlertDescription>
              Network scanning is only available when running this app locally. 
              Please run the app on your local machine with the scanner service 
              active on http://localhost:3001 for full functionality.
            </AlertDescription>
          </Alert>
        ) : !hasScanner ? (
          <Alert variant="default" className="mt-2">
            <Info className="h-4 w-4" />
            <AlertDescription>
              For accurate device detection, ensure the local network scanner is running on http://localhost:3001
            </AlertDescription>
          </Alert>
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        <ConnectedDevices networkStatus={networkStatus} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};
