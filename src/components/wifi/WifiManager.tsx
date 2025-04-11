
import React, { useState } from 'react';
import { Wifi, WifiOff, Lock, RefreshCw, Signal, Activity, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import '../overview/index.css';

const WifiManager: React.FC = () => {
  const { 
    networkStatus, 
    isLoading, 
    refreshNetworkStatus,
    connectToNetwork,
    disconnectFromNetwork
  } = useNetworkStatus();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<{id: number, ssid: string} | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [scanInProgress, setScanInProgress] = useState(false);

  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleConnect = (network: {id: number, ssid: string}) => {
    setSelectedNetwork(network);
    setShowPasswordDialog(true);
  };

  const handleScanNetworks = () => {
    setScanInProgress(true);
    toast.info("Scanning for WiFi networks...");
    
    refreshNetworkStatus();
    
    // Simulate scanning completion
    setTimeout(() => {
      setScanInProgress(false);
      toast.success("Network scan complete");
    }, 3000);
  };

  const handleSubmitPassword = async () => {
    if (!selectedNetwork) return;
    
    setIsConnecting(true);
    
    try {
      const success = await connectToNetwork(selectedNetwork.ssid, password);
      if (success) {
        setShowPasswordDialog(false);
        setPassword('');
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error(`Failed to connect to ${selectedNetwork.ssid}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!networkStatus?.networkName) return;
    
    setIsDisconnecting(true);
    
    try {
      await disconnectFromNetwork();
    } catch (error) {
      console.error("Disconnection error:", error);
      toast.error("Failed to disconnect from network");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Connection</TabsTrigger>
          <TabsTrigger value="available">Available Networks</TabsTrigger>
          <TabsTrigger value="diagnostics">Network Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
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
                      <p className="font-semibold text-lg">{networkStatus.networkName}</p>
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
                    <div className="info-value">{networkStatus.gatewayIp}</div>
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
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          {/* Available Networks */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" /> Available Networks
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
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={18} />
                Network Diagnostics
              </CardTitle>
              <CardDescription>
                Tools to analyze and troubleshoot your network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Network Latency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold">{networkStatus?.connectionSpeed.latency || "--"}</div>
                      <div className="text-sm text-gray-500">ms</div>
                    </div>
                    <div className={`text-xs ${networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 20 ? 'text-green-500' : networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 20 ? 'Excellent' : 
                      networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 50 ? 'Good' : 
                      networkStatus?.connectionSpeed.latency ? 'Poor' : 'Unknown'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Network Stability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {networkStatus?.connectionHistory && networkStatus.connectionHistory.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          {networkStatus.connectionHistory.slice(-10).map((event, i) => (
                            <div 
                              key={i}
                              className={`flex-1 h-8 ${event.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Last 10 connection events</span>
                          <span>Now</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-4 text-gray-500">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        No connection data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diagnostic-tools">Diagnostic Tools</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Run Speed Test</Button>
                  <Button variant="outline" size="sm">Ping Gateway</Button>
                  <Button variant="outline" size="sm">Check DNS</Button>
                  <Button variant="outline" size="sm">View Connection Log</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
