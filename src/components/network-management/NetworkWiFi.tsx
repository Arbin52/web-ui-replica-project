
import React from 'react';
import { Wifi } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import WifiManager from '../wifi/WifiManager';

export const NetworkWiFi: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi size={18} />
          WiFi Management
        </CardTitle>
        <CardDescription>
          View and manage WiFi networks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WifiManager />
      </CardContent>
    </Card>
  );
};
