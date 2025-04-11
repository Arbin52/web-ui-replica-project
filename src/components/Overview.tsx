import React, { useState } from 'react';
import { Info, Router, ExternalLink, RefreshCw, Wifi, Globe, Activity, PauseCircle, PlayCircle, Clock, BarChart2, Signal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Skeleton } from '@/components/ui/skeleton';
import { DeviceList } from '@/components/devices/DeviceList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Overview: React.FC = () => {
  const { 
    networkStatus, 
    isLoading, 
    error, 
    refreshNetworkStatus,
    isLiveUpdating,
    toggleLiveUpdates,
    updateInterval,
    setRefreshRate 
  } = useNetworkStatus();
  const [activeInfoTab, setActiveInfoTab] = useState('basic');
  const [activeNetworkTab, setActiveNetworkTab] = useState('connected');

  const handleGatewayClick = () => {
    if (networkStatus?.gatewayIp) {
      let url = networkStatus.gatewayIp;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefresh = () => {
    refreshNetworkStatus();
  };

  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
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
        <div className="flex items-center gap-2">
          <Select
            value={updateInterval.toString()}
            onValueChange={(value) => setRefreshRate(parseInt(value))}
            disabled={!isLiveUpdating || isLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Refresh Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">Every 1 second</SelectItem>
              <SelectItem value="3000">Every 3 seconds</SelectItem>
              <SelectItem value="5000">Every 5 seconds</SelectItem>
              <SelectItem value="10000">Every 10 seconds</SelectItem>
              <SelectItem value="30000">Every 30 seconds</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="flex items-center gap-1" 
            onClick={toggleLiveUpdates}
          >
            {isLiveUpdating ? (
              <>
                <PauseCircle size={16} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <PlayCircle size={16} />
                <span>Resume</span>
              </>
            )}
          </Button>
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
          icon={<Clock className="h-5 w-5" />}
          description="Current ping time"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Data Downloaded"
          value={isLoading ? "" : `${networkStatus?.dataUsage?.download} MB`}
          icon={<BarChart2 className="h-5 w-5" />}
          isLoading={isLoading}
        />

        <DashboardCard
          title="Data Uploaded"
          value={isLoading ? "" : `${networkStatus?.dataUsage?.upload} MB`}
          icon={<BarChart2 className="h-5 w-5" />}
          isLoading={isLoading}
        />

        <DashboardCard
          title="Total Data Used"
          value={isLoading ? "" : `${networkStatus?.dataUsage?.total} MB`}
          icon={<BarChart2 className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Tabs value={activeInfoTab} onValueChange={setActiveInfoTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="animate-fade-in">
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
                              {networkStatus?.gatewayIp.replace('http://', '')}
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

                  <div className="info-row">
                    <div className="info-label">Status History:</div>
                    <div className="info-value">
                      {networkStatus?.connectionHistory && networkStatus.connectionHistory.length > 0 ? (
                        <div className="mt-2 max-h-24 overflow-y-auto text-xs">
                          {networkStatus.connectionHistory.slice().reverse().map((event, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full ${event.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span>{event.status === 'connected' ? 'Connected' : 'Disconnected'}</span>
                              <span className="text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No history available</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="animate-fade-in">
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
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Tabs value={activeNetworkTab} onValueChange={setActiveNetworkTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="connected">Connected Devices</TabsTrigger>
              <TabsTrigger value="available">Available Networks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connected">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Router size={18} />
                    <CardTitle className="text-lg">Connected Devices ({isLoading ? '...' : networkStatus?.connectedDevices.length})</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      <DeviceList filter="all" className="border-0 divide-y divide-gray-100" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="available">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Signal size={18} />
                    <CardTitle className="text-lg">Available Networks ({isLoading ? '...' : networkStatus?.availableNetworks?.length || 0})</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : networkStatus?.availableNetworks && networkStatus.availableNetworks.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500">
                            <th className="pb-2">Network Name</th>
                            <th className="pb-2">Signal</th>
                            <th className="pb-2">Security</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {networkStatus.availableNetworks.map((network) => (
                            <tr key={network.id} className="hover:bg-gray-50">
                              <td className="py-3">{network.ssid}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        getSignalStrength(network.signal) > 70 ? 'bg-green-500' : 
                                        getSignalStrength(network.signal) > 40 ? 'bg-yellow-500' : 
                                        'bg-red-500'
                                      }`}
                                      style={{ width: `${getSignalStrength(network.signal)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{network.signal} dBm</span>
                                </div>
                              </td>
                              <td className="py-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {network.security}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No available networks found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {networkStatus && (
        <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
          <Wifi size={12} />
          <span>Last updated: {networkStatus.lastUpdated.toLocaleTimeString()}</span>
          {!isLiveUpdating && (
            <span className="ml-2 text-amber-500 flex items-center gap-1">
              <PauseCircle size={12} />
              Live updates paused
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Overview;
