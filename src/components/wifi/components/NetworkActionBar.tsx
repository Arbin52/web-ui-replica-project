
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from 'lucide-react';
import DeviceSimulation from './DeviceSimulation';

interface NetworkActionBarProps {
  handleScanNetworks: () => void;
  scanInProgress: boolean;
  simulateDeviceConnect: () => void;
  simulateDeviceDisconnect: () => void;
}

const NetworkActionBar: React.FC<NetworkActionBarProps> = ({
  handleScanNetworks,
  scanInProgress,
  simulateDeviceConnect,
  simulateDeviceDisconnect
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleScanNetworks}
        disabled={scanInProgress}
        className="flex items-center gap-1"
      >
        {scanInProgress ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        {scanInProgress ? 'Scanning...' : 'Scan Networks'}
      </Button>
      <DeviceSimulation 
        onConnectDevice={simulateDeviceConnect} 
        onDisconnectDevice={simulateDeviceDisconnect} 
      />
    </div>
  );
};

export default NetworkActionBar;
