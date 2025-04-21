
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Globe, Wifi, Shield, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GPONGatewayLogin } from './GPONGatewayLogin';
import { RouterStatusPanel } from "./RouterStatusPanel";
import { RouterWifiPanel } from "./RouterWifiPanel";
import { RouterSecurityPanel } from "./RouterSecurityPanel";
import { RouterAdvancedPanel } from "./RouterAdvancedPanel";

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
  // All hooks must be declared at the component level
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('status');
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [wifiName, setWifiName] = useState('HomeNetwork-5G');
  const [password, setPassword] = useState('••••••••••••');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [visibleInUI, setVisibleInUI] = useState(false);
  
  // Effect to open gateway in new tab if using real network or show in UI
  useEffect(() => {
    if (isRealNetwork && open) {
      window.open(`http://${gatewayIp}`, '_blank');
      onClose();
      return;
    }
    
    // For mock network, update visibility based on open state
    setVisibleInUI(open);
  }, [isRealNetwork, open, gatewayIp, onClose]);
  
  // Effect to manage login dialog visibility
  useEffect(() => {
    if (open && !isLoggedIn && !isRealNetwork) {
      setShowLoginDialog(true);
    } else {
      setShowLoginDialog(false);
    }
  }, [open, isLoggedIn, isRealNetwork]);
  
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
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginDialog(false);
  };
  
  // Always return a component or null - never return early
  const renderLoginDialog = () => {
    if (visibleInUI && showLoginDialog) {
      return (
        <GPONGatewayLogin
          isOpen={true}
          onSuccess={handleLoginSuccess}
        />
      );
    }
    return null;
  };
  
  // Always return a component or null - never return early
  const renderRouterAdmin = () => {
    if (visibleInUI && isLoggedIn) {
      return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
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
                      <RouterStatusPanel
                        gatewayIp={gatewayIp}
                        loading={loading}
                        handleRefresh={handleRefresh}
                      />
                    </TabsContent>

                    <TabsContent value="wifi" className="space-y-4">
                      <RouterWifiPanel
                        wifiEnabled={wifiEnabled}
                        setWifiEnabled={setWifiEnabled}
                        wifiName={wifiName}
                        setWifiName={setWifiName}
                        password={password}
                        setPassword={setPassword}
                        isSaving={isSaving}
                        handleSaveSettings={handleSaveSettings}
                      />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                      <RouterSecurityPanel />
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <RouterAdvancedPanel />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    return null;
  };

  // Final return with no conditionals that would cause early returns
  // All render logic is moved to helper functions that always return a value
  return (
    <>
      {renderLoginDialog()}
      {renderRouterAdmin()}
    </>
  );
};

export default MockRouterAdmin;
