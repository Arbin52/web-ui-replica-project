
import React from 'react';
import { Info, Router, ExternalLink, RefreshCw, Wifi, Globe, Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Skeleton } from '@/components/ui/skeleton';
import { DeviceList } from '@/components/devices/DeviceList';

const Overview: React.FC = () => {
  const { networkStatus, isLoading, error, refreshNetworkStatus } = useNetworkStatus();

  const handleGatewayClick = () => {
    if (networkStatus?.gatewayIp) {
      window.open(`http://${networkStatus.gatewayIp}`, '_blank');
    }
  };

  const handleRefresh = () => {
    refreshNetworkStatus();
  };

  if (error) {
    return (
      <div className="content-card animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Info size={24} />
          <h2 className="text-xl font-bold">Network Overview</h2>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <div className="flex items-center gap-2">
            <span className="font-bold">Error:</span>
            <span>{error}</span>
          </div>
          <Button onClick={handleRefresh} className="mt-2 bg-red-100 text-red-700 hover:bg-red-200">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Info size={24} />
          <h2 className="text-xl font-bold">Network Overview</h2>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-1" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Network Status"
          value={isLoading ? "" : networkStatus?.isOnline ? "Online" : "Offline"}
          icon={<Globe className="h-5 w-5" />}
          change={{
            value: 100,
            trend: "up"
          }}
          isLoading={isLoading}
        />

        <DashboardCard
          title="Download Speed"
          value={isLoading ? "" : `${networkStatus?.connectionSpeed.download} Mbps`}
          icon={<Activity className="h-5 w-5" />}
          isLoading={isLoading}
        />

        <DashboardCard
          title="Upload Speed"
          value={isLoading ? "" : `${networkStatus?.connectionSpeed.upload} Mbps`}
          icon={<Activity className="h-5 w-5" />}
          isLoading={isLoading}
        />

        <DashboardCard
          title="Latency"
          value={isLoading ? "" : `${networkStatus?.connectionSpeed.latency} ms`}
          icon={<Activity className="h-5 w-5" />}
          description="Current ping time"
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Basic Information</h3>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <>
              <div className="info-row">
                <div className="info-label">Wi-Fi Network Name:</div> 
                <div className="info-value">{networkStatus?.networkName}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Local IP Address:</div>
                <div className="info-value">{networkStatus?.localIp}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Public IP Address:</div>
                <div className="info-value">{networkStatus?.publicIp}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Gateway IP Address:</div>
                <div className="info-value">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={handleGatewayClick} 
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {networkStatus?.gatewayIp}
                          <ExternalLink size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Access router admin interface</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Signal Strength:</div>
                <div className="info-value">
                  {networkStatus?.signalStrength} ({networkStatus?.signalStrengthDb})
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        networkStatus?.signalStrength === 'Good' ? 'bg-green-500' : 
                        networkStatus?.signalStrength === 'Fair' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: networkStatus?.signalStrength === 'Good' ? '90%' : 
                              networkStatus?.signalStrength === 'Fair' ? '60%' : '30%' }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Network Type:</div>
                <div className="info-value">{networkStatus?.networkType}</div>
              </div>
            </>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Advanced Details</h3>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <>
              <div className="info-row">
                <div className="info-label">MAC Address:</div>
                <div className="info-value">{networkStatus?.macAddress}</div>
              </div>
              
              <div className="info-row">
                <div className="info-label">DNS Servers:</div>
                <div className="info-value">{networkStatus?.dnsServer}</div>
              </div>
            </>
          )}
          
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Router size={18} />
              <h3 className="text-lg font-semibold">Connected Devices ({isLoading ? '...' : networkStatus?.connectedDevices.length})</h3>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-md max-h-72 overflow-y-auto">
                <DeviceList filter="all" className="border-0 divide-y divide-gray-100" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {networkStatus && (
        <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
          <Wifi size={12} />
          <span>Last updated: {networkStatus.lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export default Overview;
