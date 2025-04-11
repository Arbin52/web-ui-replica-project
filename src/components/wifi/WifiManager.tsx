
import React, { useState } from 'react';
import { Wifi, WifiOff, Lock, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const WifiManager: React.FC = () => {
  const { 
    networkStatus, 
    isLoading, 
    refreshNetworkStatus 
  } = useNetworkStatus();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<{id: number, ssid: string} | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleConnect = (network: {id: number, ssid: string}) => {
    setSelectedNetwork(network);
    setShowPasswordDialog(true);
  };

  const handleSubmitPassword = () => {
    if (!selectedNetwork) return;
    
    setIsConnecting(true);
    
    // In a real app, this would make an API call to connect to the network
    setTimeout(() => {
      setIsConnecting(false);
      setShowPasswordDialog(false);
      toast.success(`Connected to ${selectedNetwork.ssid}`);
      refreshNetworkStatus();
      setPassword('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Current Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {networkStatus?.isOnline ? 
              <><Wifi className="h-5 w-5 text-green-500" /> Connected</>
              : 
              <><WifiOff className="h-5 w-5 text-red-500" /> Disconnected</>
            }
          </CardTitle>
          <CardDescription>
            Your current WiFi connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : networkStatus?.isOnline ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{networkStatus.networkName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Signal: {networkStatus.signalStrength} ({networkStatus.signalStrengthDb})
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshNetworkStatus}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Signal Strength</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
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
          ) : (
            <div className="text-center py-4">
              <WifiOff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">
                Not connected to any WiFi network
              </p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={refreshNetworkStatus}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Networks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" /> Available Networks
          </CardTitle>
          <CardDescription>
            WiFi networks detected nearby
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : networkStatus?.availableNetworks && networkStatus.availableNetworks.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
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
          
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={refreshNetworkStatus}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan for Networks
          </Button>
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
    </div>
  );
};

export default WifiManager;
