
import React, { useState } from 'react';
import { Signal, Lock, WifiOff, Wifi } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetworkStatus } from '@/hooks/network/types';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';

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
    setPassword('');
    setShowPasswordDialog(true);
  };

  const handleSubmitPassword = async () => {
    if (!selectedNetwork) return;
    
    setIsConnecting(true);
    toast.info(`Connecting to ${selectedNetwork.ssid}...`);
    
    try {
      await connectToNetwork(selectedNetwork.ssid, password);
      toast.success(`Connected to ${selectedNetwork.ssid}`);
    } catch (error) {
      toast.error('Failed to connect to network');
    } finally {
      setIsConnecting(false);
      setShowPasswordDialog(false);
      setPassword('');
    }
  };

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="pb-2 bg-muted/30">
          <div className="flex items-center gap-2">
            <Signal size={18} className="text-primary" />
            <CardTitle className="text-lg">
              Available Networks
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({isLoading ? '...' : networkStatus?.availableNetworks?.length || 0})
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : networkStatus?.availableNetworks && networkStatus.availableNetworks.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              <div className="grid gap-2">
                {networkStatus.availableNetworks.map((network) => {
                  const signalStrength = getSignalStrength(network.signal);
                  const isConnected = networkStatus.networkName === network.ssid && networkStatus.isOnline;
                  
                  return (
                    <div key={network.id} 
                      className={`flex items-center justify-between p-3 rounded-md border transition-colors
                        ${isConnected 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-background hover:bg-muted/50 border-muted'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${isConnected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Wifi size={16} />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{network.ssid}</span>
                            {network.security === 'WPA2' || network.security === 'WPA3' ? (
                              <Lock size={12} className="ml-2 text-muted-foreground" />
                            ) : null}
                            {isConnected && (
                              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Connected</span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="w-16 h-1.5 bg-muted rounded-full mr-2">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  signalStrength > 70 ? 'bg-green-500' : 
                                  signalStrength > 40 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${signalStrength}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground">{network.signal} dBm</span>
                          </div>
                        </div>
                      </div>
                      {!isConnected && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConnect(network)}
                          className="bg-background hover:bg-muted"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <WifiOff className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>No available networks found</p>
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
                autoFocus
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
