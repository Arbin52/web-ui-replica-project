
import React from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, WifiOff } from 'lucide-react';

interface DeviceSimulationProps {
  onConnectDevice: () => void;
  onDisconnectDevice: () => void;
}

const DeviceSimulation: React.FC<DeviceSimulationProps> = ({
  onConnectDevice,
  onDisconnectDevice
}) => {
  return (
    <>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onConnectDevice}
        className="flex items-center gap-1"
      >
        <Smartphone size={14} />
        Sim. Device Connect
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={onDisconnectDevice}
        className="flex items-center gap-1"
      >
        <WifiOff size={14} />
        Sim. Device Disconnect
      </Button>
    </>
  );
};

export default DeviceSimulation;
