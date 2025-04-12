
import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DisconnectedStateProps {
  handleScanNetworks: () => void;
  scanInProgress: boolean;
}

export const DisconnectedState: React.FC<DisconnectedStateProps> = ({ handleScanNetworks, scanInProgress }) => {
  return (
    <div className="text-center py-4">
      <WifiOff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
      <p className="text-gray-500 dark:text-gray-400">
        Not connected to any WiFi network
      </p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={handleScanNetworks}
        disabled={scanInProgress}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${scanInProgress ? 'animate-spin' : ''}`} />
        {scanInProgress ? "Scanning..." : "Scan for Networks"}
      </Button>
    </div>
  );
};
