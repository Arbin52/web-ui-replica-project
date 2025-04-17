
import React, { useState } from 'react';
import { Wifi } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import WifiManager from '../wifi/WifiManager';
import SecuritySettings from '../wifi/components/SecuritySettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const NetworkWiFi: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manager');

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="manager">Network Manager</TabsTrigger>
            <TabsTrigger value="security">Security Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manager">
            <WifiManager />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
