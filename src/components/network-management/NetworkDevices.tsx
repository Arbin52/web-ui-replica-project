
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ConnectedDevices } from '../overview/ConnectedDevices';
import { NetworkStatus } from '@/hooks/network/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertCircle, ExternalLink, Terminal, PlayCircle } from 'lucide-react';
import { useRealDevices } from '@/hooks/useRealDevices';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

  const { hasScanner, checkScannerAvailability } = useRealDevices();
  
  // Function to handle scanner status check
  const handleCheckScannerStatus = () => {
    window.open('http://localhost:3001/status', '_blank');
  };
  
  // Function to open setup guide
  const handleOpenSetupGuide = () => {
    window.open('/SETUP.md', '_blank');
  };
  
  // Function to refresh scanner status
  const handleRefreshScannerStatus = () => {
    toast.info('Checking scanner status...');
    checkScannerAvailability();
    // We removed the .then() call that was causing the error
  };

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
              Please run the app on your local machine for full functionality.
            </AlertDescription>
          </Alert>
        ) : !hasScanner ? (
          <Alert variant="default" className="mt-2 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-medium">Local Network Scanner Not Running</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-2">Simple steps to start the scanner:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open a terminal window</li>
                <li>Run <code className="bg-amber-100 px-1 rounded">cd scanner</code></li>
                <li>Run <code className="bg-amber-100 px-1 rounded">node setup.js</code></li>
                <li>Run <code className="bg-amber-100 px-1 rounded">npm start</code></li>
              </ol>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline" 
                  size="sm"
                  className="border-amber-300 hover:bg-amber-100 text-amber-900 flex items-center gap-1"
                  onClick={handleCheckScannerStatus}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Check Scanner Status</span>
                </Button>
                <Button
                  variant="default" 
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"
                  onClick={handleOpenSetupGuide}
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  <span>Setup Guide</span>
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  className="border-amber-300 hover:bg-amber-100 text-amber-900"
                  onClick={handleRefreshScannerStatus}
                >
                  Refresh Scanner Status
                </Button>
              </div>
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
