
import React from 'react';
import { Wifi, WifiOff, RefreshCw, Edit2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NetworkStatus } from '@/hooks/network/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from 'sonner';
import '../../overview/index.css';

interface CurrentConnectionProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  isDisconnecting: boolean;
  handleScanNetworks: () => void;
  handleDisconnect: () => void;
  scanInProgress: boolean;
  onEditNetworkName?: () => void;
}

const CurrentConnection: React.FC<CurrentConnectionProps> = ({
  networkStatus,
  isLoading,
  isDisconnecting,
  handleScanNetworks,
  handleDisconnect,
  scanInProgress,
  onEditNetworkName
}) => {
  // Format network name for display - don't show generic names like "Connected Network"
  const displayNetworkName = () => {
    const name = networkStatus?.networkName || "Unknown Network";
    if (name === "Connected Network") return "Unknown Network";
    return name;
  };

  // Function to handle gateway IP click
  const handleGatewayClick = () => {
    if (networkStatus?.gatewayIp) {
      try {
        // Open gateway IP in new tab
        const gatewayUrl = `http://${networkStatus.gatewayIp}`;
        window.open(gatewayUrl, '_blank');
        toast.info('Opening router admin interface');
      } catch (error) {
        toast.error('Failed to open router interface');
        console.error('Error opening gateway URL:', error);
      }
    }
  };

  return (
    <Card className="relative">
      {/* Add real-time indicator */}
      {networkStatus?.isOnline && (
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {networkStatus?.isOnline ? 
            <><Wifi className="h-5 w-5 text-green-500" /> Connected</>
            : 
            <><WifiOff className="h-5 w-5 text-red-500" /> Disconnected</>
          }
        </CardTitle>
        <CardDescription>
          Your current WiFi connection status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : networkStatus?.isOnline ? (
          <div className="space-y-4">
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
                  Connected since {new Date(networkStatus.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <div className="wifi-signal-indicator">
                    <div className={`wifi-signal-bar h-3 ${networkStatus.signalStrength !== 'Poor' ? 'active' : ''}`}></div>
                    <div className={`wifi-signal-bar h-4 ${networkStatus.signalStrength !== 'Poor' ? 'active' : ''}`}></div>
                    <div className={`wifi-signal-bar h-5 ${networkStatus.signalStrength === 'Good' ? 'active' : ''}`}></div>
                    <div className={`wifi-signal-bar h-6 ${networkStatus.signalStrength === 'Good' ? 'active' : ''}`}></div>
                  </div>
                  <span className="text-sm font-medium">{networkStatus.signalStrengthDb}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{networkStatus.signalStrength}</span>
              </div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Local IP:</div>
              <div className="info-value">{networkStatus.localIp}</div>
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
                        {networkStatus.gatewayIp}
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
              <div className="info-value">{networkStatus.dnsServer}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Network Type:</div>
              <div className="info-value">{networkStatus.networkType}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">MAC Address:</div>
              <div className="info-value">{networkStatus.macAddress}</div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Connection Speed</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{networkStatus.connectionSpeed.download}<span className="text-sm ml-1">Mbps</span></p>
                  <p className="text-xs text-gray-500">Download</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{networkStatus.connectionSpeed.upload}<span className="text-sm ml-1">Mbps</span></p>
                  <p className="text-xs text-gray-500">Upload</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {networkStatus?.isOnline && (
          <Button 
            variant="destructive" 
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CurrentConnection;
