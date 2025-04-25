
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Signal, Database, Shield, Wifi, Router, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { NetworkStatus } from '@/hooks/network/types';

interface NetworkStatusSectionProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  handleGatewayClick: () => void;
}

export const NetworkStatusSection: React.FC<NetworkStatusSectionProps> = ({
  networkStatus,
  isLoading,
  handleGatewayClick
}) => {
  // Pre-format speed values
  const displayDownload = networkStatus?.connectionSpeed.download ? 
    parseFloat(networkStatus.connectionSpeed.download.toFixed(1)) : 0;
  const displayUpload = networkStatus?.connectionSpeed.upload ? 
    parseFloat(networkStatus.connectionSpeed.upload.toFixed(1)) : 0;

  // Format the network name display
  const networkName = networkStatus?.networkName || 'Unknown Network';
  const networkDisplay = networkStatus?.isOnline ? networkName : 'Not Connected';
  
  // Get device info for display
  const deviceName = (() => {
    // Try to detect the device type/name
    if (navigator.userAgent.includes('Windows')) return 'Windows PC';
    if (navigator.userAgent.includes('Mac')) return 'Mac';
    if (navigator.userAgent.includes('iPhone')) return 'iPhone';
    if (navigator.userAgent.includes('iPad')) return 'iPad';
    if (navigator.userAgent.includes('Android')) return 'Android Device';
    return 'This Device';
  })();

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${networkStatus?.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <Wifi size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                {networkDisplay}
              </h2>
              <p className="text-muted-foreground">
                {networkStatus?.isOnline ? 
                  `Connected via ${networkStatus?.networkType || 'WiFi'}` : 
                  "No active connection"}
              </p>
              {networkStatus?.isOnline && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Laptop size={12} className="mr-1" />
                  <span>{deviceName} connected to this network</span>
                </div>
              )}
            </div>
          </div>
          {networkStatus?.isOnline && (
            <Button variant="outline" className="gap-1" onClick={handleGatewayClick}>
              <Router size={16} />
              <span>Gateway: {networkStatus?.gatewayIp || '192.168.1.1'}</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <DashboardCard 
            title="Network Status"
            value={networkStatus?.isOnline ? "Online" : "Offline"}
            icon={<Signal size={18} />}
            description="Current connection status"
            isLoading={isLoading}
            className={`${networkStatus?.isOnline ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
          />
          <DashboardCard 
            title="Download"
            value={`${displayDownload} Mbps`}
            icon={<Database size={18} />}
            description="Current download speed"
            isLoading={isLoading}
          />
          <DashboardCard 
            title="Upload"
            value={`${displayUpload} Mbps`}
            icon={<Database size={18} />}
            description="Current upload speed"
            isLoading={isLoading}
          />
          <DashboardCard 
            title="Security"
            value={networkStatus?.availableNetworks?.find(n => n.ssid === networkStatus.networkName)?.security || "WPA2"}
            icon={<Shield size={18} />}
            description="Security protocol"
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
