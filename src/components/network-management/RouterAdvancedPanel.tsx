
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Server, HardDrive, Cpu, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const RouterAdvancedPanel: React.FC = () => {
  // Always define hooks at the top level
  const [qosEnabled, setQosEnabled] = useState(false);
  const [dmzEnabled, setDmzEnabled] = useState(false);
  const [upnpEnabled, setUpnpEnabled] = useState(true);
  const [remoteAccessEnabled, setRemoteAccessEnabled] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Advanced Settings
        </CardTitle>
        <CardDescription>Configure advanced router features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Quality of Service (QoS)</Label>
            <div className="text-sm text-muted-foreground">
              Prioritize certain types of network traffic
            </div>
          </div>
          <Switch
            checked={qosEnabled}
            onCheckedChange={setQosEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">UPnP</Label>
            <div className="text-sm text-muted-foreground">
              Allow devices to discover each other on the network
            </div>
          </div>
          <Switch
            checked={upnpEnabled}
            onCheckedChange={setUpnpEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">DMZ Host</Label>
            <div className="text-sm text-muted-foreground">
              Set a device outside the firewall protection
            </div>
          </div>
          <Switch
            checked={dmzEnabled}
            onCheckedChange={setDmzEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Remote Management</Label>
            <div className="text-sm text-muted-foreground">
              Access router settings from the Internet
            </div>
          </div>
          <Switch
            checked={remoteAccessEnabled}
            onCheckedChange={setRemoteAccessEnabled}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="ml-auto">
          Reset to Default
        </Button>
      </CardFooter>
    </Card>
  );
};
