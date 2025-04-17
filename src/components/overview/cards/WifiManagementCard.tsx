
import React, { memo } from 'react';
import { Wifi } from 'lucide-react';
import OptimizedFeatureCard from '../OptimizedFeatureCard';

interface WifiManagementCardProps {
  networkName: string | undefined;
  signalStrength: string | undefined;
}

const WifiManagementCard: React.FC<WifiManagementCardProps> = ({ networkName, signalStrength }) => {
  // Pre-calculate signal strength
  const signalBars = signalStrength === 'Good' ? 4 : 
                     signalStrength === 'Fair' ? 3 : 2;

  return (
    <OptimizedFeatureCard
      icon={<Wifi size={18} className="text-blue-500" />}
      title="WiFi Management"
      description="Manage connections"
      path="/wifi"
      buttonText="Manage WiFi"
    >
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">Connected to</p>
        <p className="font-semibold">{networkName || 'Not connected'}</p>
        <div className="flex items-center mt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`ml-1 h-${i+2} w-1 rounded-sm ${
              i < signalBars ? 'bg-blue-500' : 'bg-gray-300'
            }`}></div>
          ))}
          <span className="ml-2 text-xs">
            {signalStrength || 'Unknown'}
          </span>
        </div>
      </div>
    </OptimizedFeatureCard>
  );
};

export default memo(WifiManagementCard);
