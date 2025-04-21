import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, RefreshCw, Wifi, Shield, Settings, Globe, Upload, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GPONGatewayLogin } from './GPONGatewayLogin';

interface MockRouterAdminProps {
  open: boolean;
  onClose: () => void;
  gatewayIp: string;
  isRealNetwork?: boolean;
}

const MockRouterAdmin: React.FC<MockRouterAdminProps> = ({ 
  open, 
  onClose, 
  gatewayIp,
  isRealNetwork = false
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('status');
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [wifiName, setWifiName] = useState('HomeNetwork-5G');
  const [password, setPassword] = useState('••••••••••••');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isRealNetwork && open) {
      window.open(`http://${gatewayIp}`, '_blank');
      onClose();
    }
  }, [isRealNetwork, open, gatewayIp, onClose]);
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  if (isRealNetwork) {
    return null; // We don't render anything if in real network mode
  }

  if (open && !isLoggedIn) {
    return (
      <GPONGatewayLogin
        isOpen={open}
        onSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden">
        <div className="flex h-full flex-col">
          <DialogHeader className="p-6 border-b bg-primary text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-2xl font-bold">Router Admin Interface</DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  {gatewayIp} • Default Router
                </DialogDescription>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onClose}
                className="h-8"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> 
                Return to App
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-64 border-r bg-muted/30 p-4 hidden md:block">
              <div className="space-y-1">
                <Button 
                  variant={activeTab === 'status' ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('status')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Status
                </Button>
                <Button 
                  variant={activeTab === 'wifi' ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('wifi')}
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  WiFi Settings
                </Button>
                <Button 
                  variant={activeTab === 'security' ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </Button>
                <Button 
                  variant={activeTab === 'advanced' ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('advanced')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 md:hidden">
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="wifi">WiFi</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Network Status
                      </CardTitle>
                      <CardDescription>Current router status and performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Connection:</span> 
                            <span className="font-medium text-green-600">Connected</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Internet:</span> 
                            <span className="font-medium text-green-600">Online</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">WAN IP:</span> 
                            <span className="font-medium">203.0.113.1</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">LAN IP:</span> 
                            <span className="font-medium">{gatewayIp}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">WiFi Status:</span> 
                            <span className="font-medium text-green-600">Active</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Connected Devices:</span> 
                            <span className="font-medium">7</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">MAC Address:</span> 
                            <span className="font-medium">00:11:22:33:44:55</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Uptime:</span> 
                            <span className="font-medium">7d 3h 42m</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <h4 className="font-medium text-sm">Connection Speed</h4>
                        <div className="flex gap-4">
                          <div className="flex-1 p-3 bg-primary/5 rounded-md flex flex-col items-center">
                            <Download className="h-5 w-5 text-blue-500 mb-1" />
                            <div className="text-2xl font-bold">120 <span className="text-sm font-normal">Mbps</span></div>
                            <div className="text-xs text-muted-foreground">Download</div>
                          </div>
                          <div className="flex-1 p-3 bg-primary/5 rounded-md flex flex-col items-center">
                            <Upload className="h-5 w-5 text-green-500 mb-1" />
                            <div className="text-2xl font-bold">25 <span className="text-sm font-normal">Mbps</span></div>
                            <div className="text-xs text-muted-foreground">Upload</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh} 
                        disabled={loading}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Refresh Status
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="wifi" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <Wifi className="h-5 w-5 mr-2" />
                        WiFi Configuration
                      </CardTitle>
                      <CardDescription>Manage your wireless network settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">WiFi Network</Label>
                            <div className="text-sm text-muted-foreground">
                              Enable or disable your wireless network
                            </div>
                          </div>
                          <Switch 
                            checked={wifiEnabled} 
                            onCheckedChange={setWifiEnabled} 
                          />
                        </div>
                        
                        {wifiEnabled && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="ssid">Network Name (SSID)</Label>
                              <Input 
                                id="ssid" 
                                value={wifiName} 
                                onChange={(e) => setWifiName(e.target.value)} 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="security">Security Type</Label>
                              <select 
                                id="security" 
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                defaultValue="wpa2"
                              >
                                <option value="wpa3">WPA3-Personal</option>
                                <option value="wpa2">WPA2-Personal</option>
                                <option value="wpa">WPA-Personal</option>
                                <option value="none">None (Open Network)</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="channel">WiFi Channel</Label>
                              <select 
                                id="channel" 
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                defaultValue="auto"
                              >
                                <option value="auto">Auto</option>
                                <option value="1">Channel 1</option>
                                <option value="6">Channel 6</option>
                                <option value="11">Channel 11</option>
                              </select>
                              <p className="text-xs text-muted-foreground mt-1">
                                Auto selects the least congested channel automatically
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        onClick={handleSaveSettings} 
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>Configure firewall and security features</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center py-8 text-muted-foreground">
                        This is a mock router interface. Security settings would be shown here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Advanced Settings
                      </CardTitle>
                      <CardDescription>Configure advanced router features</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center py-8 text-muted-foreground">
                        This is a mock router interface. Advanced settings would be shown here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockRouterAdmin;
