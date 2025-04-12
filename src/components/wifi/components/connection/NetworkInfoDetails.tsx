
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from 'sonner';

interface NetworkInfoDetailsProps {
  localIp: string;
  gatewayIp: string;
  dnsServer: string;
  networkType: string;
  macAddress: string;
}

export const NetworkInfoDetails: React.FC<NetworkInfoDetailsProps> = ({
  localIp,
  gatewayIp,
  dnsServer,
  networkType,
  macAddress
}) => {
  // Function to handle gateway IP click
  const handleGatewayClick = () => {
    if (gatewayIp) {
      try {
        // Open gateway IP in new tab
        const gatewayUrl = `http://${gatewayIp}`;
        window.open(gatewayUrl, '_blank');
        toast.info('Opening router admin interface');
      } catch (error) {
        toast.error('Failed to open router interface');
        console.error('Error opening gateway URL:', error);
      }
    }
  };

  return (
    <>
      <div className="info-row">
        <div className="info-label">Local IP:</div>
        <div className="info-value">{localIp}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Gateway:</div>
        <div className="info-value">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleGatewayClick} 
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  {gatewayIp}
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
        <div className="info-label">DNS Servers:</div>
        <div className="info-value">{dnsServer}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Network Type:</div>
        <div className="info-value">{networkType}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">MAC Address:</div>
        <div className="info-value">{macAddress}</div>
      </div>
    </>
  );
};
