
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { NetworkStatus } from '@/hooks/network/types';

interface BasicNetworkInfoProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  handleGatewayClick: () => void;
}

export const BasicNetworkInfo: React.FC<BasicNetworkInfoProps> = ({ 
  networkStatus, 
  isLoading, 
  handleGatewayClick 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="info-row">
        <div className="info-label">Wi-Fi Network Name:</div> 
        <div className="info-value font-semibold">{networkStatus?.networkName || "Not Available"}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Local IP Address:</div>
        <div className="info-value">{networkStatus?.localIp}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Public IP Address:</div>
        <div className="info-value">{networkStatus?.publicIp}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Gateway IP Address:</div>
        <div className="info-value">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleGatewayClick} 
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  {networkStatus?.gatewayIp}
                  <ExternalLink size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Access router admin interface</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Signal Strength:</div>
        <div className="info-value">
          {networkStatus?.signalStrength} ({networkStatus?.signalStrengthDb})
          <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
            <div 
              className={`h-2 rounded-full ${
                networkStatus?.signalStrength === 'Good' ? 'bg-green-500' : 
                networkStatus?.signalStrength === 'Fair' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: networkStatus?.signalStrength === 'Good' ? '90%' : 
                      networkStatus?.signalStrength === 'Fair' ? '60%' : '30%' }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Network Type:</div>
        <div className="info-value">{networkStatus?.networkType}</div>
      </div>

      <div className="info-row">
        <div className="info-label">Status History:</div>
        <div className="info-value">
          {networkStatus?.connectionHistory && networkStatus.connectionHistory.length > 0 ? (
            <div className="mt-2 max-h-24 overflow-y-auto text-xs">
              {networkStatus.connectionHistory.slice().reverse().map((event, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${event.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>{event.status === 'connected' ? 'Connected' : 'Disconnected'}</span>
                  <span className="text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">No history available</span>
          )}
        </div>
      </div>
    </>
  );
};
