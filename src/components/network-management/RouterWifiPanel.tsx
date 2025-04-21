
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wifi, RefreshCw, Save } from "lucide-react";

interface RouterWifiPanelProps {
  wifiEnabled: boolean;
  setWifiEnabled: (val: boolean) => void;
  wifiName: string;
  setWifiName: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isSaving: boolean;
  handleSaveSettings: () => void;
}

export const RouterWifiPanel: React.FC<RouterWifiPanelProps> = ({
  wifiEnabled,
  setWifiEnabled,
  wifiName,
  setWifiName,
  password,
  setPassword,
  isSaving,
  handleSaveSettings
}) => (
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
                onChange={e => setWifiName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
);

