
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from 'sonner';
import MockRouterAdmin from '@/components/network-management/MockRouterAdmin';

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
  const [isMockRouterOpen, setIsMockRouterOpen] = useState(false);
  
  // Function to handle gateway IP click - always show mock router
  const handleGatewayClick = () => {
    if (gatewayIp) {
      // Always show mock router interface in this environment
      setIsMockRouterOpen(true);
      toast.info('Opening router admin interface');
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
      
      {/* Mock Router Admin Dialog */}
      <MockRouterAdmin
        open={isMockRouterOpen}
        onClose={() => setIsMockRouterOpen(false)}
        gatewayIp={gatewayIp}
        isRealNetwork={false} // Always use mock router
      />
    </>
  );
};
