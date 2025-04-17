
import React, { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { NetworkStatus } from '@/hooks/network/types';
import { Skeleton } from '@/components/ui/skeleton';

interface NetworkStatusMonitorProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  isLiveUpdating: boolean;
  toggleLiveUpdates: () => void;
  refreshNetworkStatus: () => void;
  updateInterval: number;
}

// Ultra-simple time formatter for better performance
const formatTimeSimple = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

// Simplified monitor component that minimizes rendering and computation
export const NetworkStatusMonitor: React.FC<NetworkStatusMonitorProps> = ({ 
  networkStatus, 
  isLoading, 
  isLiveUpdating, 
  toggleLiveUpdates, 
  refreshNetworkStatus, 
  updateInterval 
}) => {
  // Direct browser API for online status
  const isOnline = navigator.onLine;
  
  // Format interval without complex operations
  const formatInterval = (ms: number) => {
    return ms >= 60000 ? `${Math.floor(ms / 60000)}m` : `${Math.floor(ms/1000)}s`;
  };

  // Load only the last 3 connection events maximum
  const connectionEvents = networkStatus?.connectionHistory 
    ? networkStatus.connectionHistory.slice(-3).reverse() 
    : [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Network Status
          </CardTitle>
          <Badge variant={isLiveUpdating ? "outline" : "secondary"}>
            {isLiveUpdating ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Live ({formatInterval(updateInterval)})
              </div>
            ) : (
              "Paused"
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className={`text-lg font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-lg font-bold">
                  {networkStatus?.lastUpdated ? formatTimeSimple(networkStatus.lastUpdated) : 'N/A'}
                </p>
              </div>
            </div>
            
            {connectionEvents.length > 0 && (
              <div className="mt-2 border rounded-md p-2">
                <p className="text-sm font-medium mb-1">Recent Activity:</p>
                {connectionEvents.map((event, idx) => (
                  <div key={idx} className="text-xs flex items-center gap-1 mb-1">
                    <span className={`w-2 h-2 rounded-full ${event.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span>{event.status === 'connected' ? 'Connected' : 'Disconnected'}</span>
                    <span className="text-gray-500">
                      {typeof event.timestamp === 'string' 
                        ? formatTimeSimple(new Date(event.timestamp)) 
                        : formatTimeSimple(event.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLiveUpdates}
        >
          {isLiveUpdating ? 'Pause' : 'Resume'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshNetworkStatus}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NetworkStatusMonitor;
