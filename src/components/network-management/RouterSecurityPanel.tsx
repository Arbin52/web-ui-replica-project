
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const RouterSecurityPanel: React.FC = () => {
  // Always define hooks at the top level
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [vpnPassthroughEnabled, setVpnPassthroughEnabled] = useState(true);
  const [securityLevel, setSecurityLevel] = useState("medium");
  const [parentalControlsEnabled, setParentalControlsEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSecurityUpdate = () => {
    setIsUpdating(true);
    // Simulate security update
    setTimeout(() => {
      setIsUpdating(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Security Settings
        </CardTitle>
        <CardDescription>Configure firewall and security features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Firewall Protection</Label>
            <div className="text-sm text-muted-foreground">
              Block unauthorized access to your network
            </div>
          </div>
          <Switch
            checked={firewallEnabled}
            onCheckedChange={setFirewallEnabled}
          />
        </div>
        
        {firewallEnabled && (
          <div className="space-y-2">
            <Label htmlFor="security-level">Security Level</Label>
            <Select value={securityLevel} onValueChange={setSecurityLevel}>
              <SelectTrigger id="security-level">
                <SelectValue placeholder="Select security level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Allow Most Traffic)</SelectItem>
                <SelectItem value="medium">Medium (Balanced)</SelectItem>
                <SelectItem value="high">High (Strict)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">VPN Passthrough</Label>
            <div className="text-sm text-muted-foreground">
              Allow VPN client connections through the router
            </div>
          </div>
          <Switch
            checked={vpnPassthroughEnabled}
            onCheckedChange={setVpnPassthroughEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Parental Controls</Label>
            <div className="text-sm text-muted-foreground">
              Restrict access to certain websites and content
            </div>
          </div>
          <Switch
            checked={parentalControlsEnabled}
            onCheckedChange={setParentalControlsEnabled}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSecurityUpdate}
          disabled={isUpdating}
          className="ml-auto"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Security
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
