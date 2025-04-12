
import React from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NetworkNameDisplayProps {
  networkName: string;
  lastUpdated: Date;
  signalStrength: string;
  signalStrengthDb: string;
  onEditNetworkName?: () => void;
}

export const NetworkNameDisplay: React.FC<NetworkNameDisplayProps> = ({
  networkName,
  lastUpdated,
  signalStrength,
  signalStrengthDb,
  onEditNetworkName
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{networkName}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEditNetworkName}
          className="h-8 w-8 p-0"
        >
          <Pencil size={14} />
        </Button>
      </div>
      
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Last updated: </span>
          <span>{lastUpdated.toLocaleTimeString()}</span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Signal: </span>
          <span className={`${
            signalStrength === 'Good' ? 'text-green-500' : 
            signalStrength === 'Fair' ? 'text-amber-500' : 
            'text-red-500'
          }`}>
            {signalStrength} ({signalStrengthDb})
          </span>
        </div>
      </div>
      
      {/* Signal strength visualization */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
        <div 
          className={`h-1.5 rounded-full ${
            signalStrength === 'Good' ? 'bg-green-500' : 
            signalStrength === 'Fair' ? 'bg-amber-500' : 
            'bg-red-500'
          }`}
          style={{ 
            width: signalStrength === 'Good' ? '90%' : 
                   signalStrength === 'Fair' ? '60%' : '30%',
            transition: 'width 0.5s ease-out'
          }}
        ></div>
      </div>
    </div>
  );
};
