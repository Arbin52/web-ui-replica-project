
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2 } from 'lucide-react';

interface StatusBarProps {
  isOnline: boolean;
  detectedNetworkName: string | null;
  shouldPromptForNetworkName: boolean;
  handleEditNetworkName: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  isOnline,
  detectedNetworkName,
  shouldPromptForNetworkName,
  handleEditNetworkName
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-sm text-muted-foreground">
          {isOnline ? 'Your device is online' : 'Your device is offline'}
        </span>
        
        {/* Always show network name section if online, with edit button */}
        {isOnline && (
          <div className="ml-2 text-sm font-medium flex items-center">
            Connected to: 
            <span className={`ml-1 ${shouldPromptForNetworkName ? 'text-amber-500' : 'text-primary'}`}>
              {shouldPromptForNetworkName ? 'Unknown Network' : detectedNetworkName}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 ml-1" 
              onClick={handleEditNetworkName} 
              title="Edit network name"
            >
              <Edit2 size={12} />
            </Button>
            
            {/* Show prompt button if we can't detect the network name */}
            {shouldPromptForNetworkName && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs ml-2 h-6 animate-pulse"
                onClick={handleEditNetworkName}
              >
                Set Network Name
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
