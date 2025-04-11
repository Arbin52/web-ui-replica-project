
import React from 'react';
import { Wifi, WifiOff, Lock, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NetworkStatus } from '@/hooks/network/types';

interface AvailableNetworksProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  scanInProgress: boolean;
  handleScanNetworks: () => void;
  handleConnect: (network: { id: number, ssid: string }) => void;
  handleDisconnect: () => void;
  isDisconnecting: boolean;
  getSignalStrength: (signalValue: number) => number;
}

const AvailableNetworks: React.FC<AvailableNetworksProps> = ({
  networkStatus,
  isLoading,
  scanInProgress,
  handleScanNetworks,
  handleConnect,
  handleDisconnect,
  isDisconnecting,
  getSignalStrength
}) => {
  // Get actual count of available networks
  const availableNetworksCount = networkStatus?.availableNetworks?.length || 0;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" /> Available Networks ({availableNetworksCount})
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleScanNetworks}
            disabled={scanInProgress}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${scanInProgress ? 'animate-spin' : ''}`} />
            {scanInProgress ? "Scanning..." : "Scan"}
          </Button>
        </div>
        <CardDescription>
          WiFi networks detected nearby
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || scanInProgress ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : networkStatus?.availableNetworks && networkStatus.availableNetworks.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b">
                  <th className="pb-2 px-2">Network Name</th>
                  <th className="pb-2 px-2">Signal</th>
                  <th className="pb-2 px-2">Security</th>
                  <th className="pb-2 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {networkStatus.availableNetworks.map((network) => (
                  <tr key={network.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="py-3 px-2 font-medium">
                      <div className="flex items-center gap-2">
                        {network.ssid === networkStatus.networkName && networkStatus.isOnline ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : null}
                        {network.ssid}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              getSignalStrength(network.signal) > 70 ? 'bg-green-500' : 
                              getSignalStrength(network.signal) > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${getSignalStrength(network.signal)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{network.signal} dBm</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs flex items-center w-fit gap-1">
                        {network.security === 'WPA2' || network.security === 'WPA3' ? <Lock size={12} /> : null}
                        {network.security}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {network.ssid === networkStatus.networkName && networkStatus.isOnline ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDisconnect}
                          disabled={isDisconnecting}
                        >
                          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleConnect(network)}
                        >
                          Connect
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <WifiOff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No available networks found</p>
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
    </Card>
  );
};

export default AvailableNetworks;
