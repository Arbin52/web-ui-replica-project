
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, RefreshCw, Download, Upload } from 'lucide-react';

interface RouterStatusPanelProps {
  gatewayIp: string;
  loading: boolean;
  handleRefresh: () => void;
}

export const RouterStatusPanel: React.FC<RouterStatusPanelProps> = ({
  gatewayIp,
  loading,
  handleRefresh
}) => (
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
);

