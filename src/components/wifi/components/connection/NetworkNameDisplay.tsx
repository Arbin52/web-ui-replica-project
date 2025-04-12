
import React from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NetworkNameDisplayProps {
  networkName: string;
  lastUpdated: string;
  signalStrength: string;
  signalStrengthDb: string;
  onEditNetworkName: () => void;
}

export const NetworkNameDisplay: React.FC<NetworkNameDisplayProps> = ({
  networkName,
  lastUpdated,
  signalStrength,
  signalStrengthDb,
  onEditNetworkName
}) => {
  // Format network name for display - don't show generic names like "Connected Network"
  const displayNetworkName = () => {
    const name = networkName || "Unknown Network";
    if (name === "Connected Network") return "Unknown Network";
    return name;
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-lg">{displayNetworkName()}</p>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={onEditNetworkName}
            title="Edit network name"
          >
            <Edit2 size={14} />
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Connected since {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2">
          <div className="wifi-signal-indicator">
            <div className={`wifi-signal-bar h-3 ${signalStrength !== 'Poor' ? 'active' : ''}`}></div>
            <div className={`wifi-signal-bar h-4 ${signalStrength !== 'Poor' ? 'active' : ''}`}></div>
            <div className={`wifi-signal-bar h-5 ${signalStrength === 'Good' ? 'active' : ''}`}></div>
            <div className={`wifi-signal-bar h-6 ${signalStrength === 'Good' ? 'active' : ''}`}></div>
          </div>
          <span className="text-sm font-medium">{signalStrengthDb}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{signalStrength}</span>
      </div>
    </div>
  );
};
