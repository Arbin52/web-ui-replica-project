
import React, { useState } from 'react';
import { Signal, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetworkStatus } from '@/hooks/network/types';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface AvailableNetworksProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const AvailableNetworks: React.FC<AvailableNetworksProps> = ({ networkStatus, isLoading }) => {
  const { connectToNetwork } = useNetworkStatus();
  const [selectedNetwork, setSelectedNetwork] = useState<{id: number, ssid: string} | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleConnect = (network: {id: number, ssid: string}) => {
    setSelectedNetwork(network);
    setShowPasswordDialog(true);
  };

  const handleSubmitPassword = async () => {
    if (!selectedNetwork) return;
    
    setIsConnecting(true);
    await connectToNetwork(selectedNetwork.ssid, password);
    setIsConnecting(false);
    setShowPasswordDialog(false);
    setPassword('');
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Signal size={18} />
            <CardTitle className="text-lg">Available Networks ({isLoading ? '...' : networkStatus?.availableNetworks?.length || 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : networkStatus?.availableNetworks && networkStatus.availableNetworks.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                    <th className="pb-2">Network Name</th>
                    <th className="pb-2">Signal</th>
                    <th className="pb-2">Security</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {networkStatus.availableNetworks.map((network) => (
                    <tr key={network.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="py-3 font-medium">{network.ssid}</td>
                      <td className="py-3">
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
                      <td className="py-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs flex items-center w-fit gap-1">
                          {network.security === 'WPA2' || network.security === 'WPA3' ? <Lock size={12} /> : null}
                          {network.security}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleConnect(network)}
                        >
                          Connect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No available networks found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to {selectedNetwork?.ssid}</DialogTitle>
            <DialogDescription>
              Enter the password for this network to connect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter network password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(false)}
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPassword}
              disabled={!password || isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
