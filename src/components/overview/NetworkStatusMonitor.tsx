import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, AlertTriangle, History } from 'lucide-react';
import { NetworkStatus } from '@/hooks/network/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getNetworkStabilityRating } from '@/hooks/network/networkHistoryUtils';
import { useNavigate } from 'react-router-dom';

interface NetworkStatusMonitorProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
  isLiveUpdating: boolean;
  toggleLiveUpdates: () => void;
  refreshNetworkStatus: () => void;
  updateInterval: number;
}

export const NetworkStatusMonitor: React.FC<NetworkStatusMonitorProps> = ({
  networkStatus,
  isLoading,
  isLiveUpdating,
  toggleLiveUpdates,
  refreshNetworkStatus,
  updateInterval
}) => {
  const navigate = useNavigate();
  
  // Function to format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  // Format interval for display
  const formatInterval = (ms: number) => {
    if (ms >= 60000) {
      const minutes = ms / 60000;
      return `${minutes}m`;
    } else {
      return `${ms/1000}s`;
    }
  };

  // Get connection history events
  const connectionEvents = networkStatus?.connectionHistory || [];
  
  // Get correct count of available networks
  const availableNetworksCount = networkStatus?.availableNetworks?.length || 0;
  
  // Get network stability info
  const stabilityInfo = getNetworkStabilityRating();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {networkStatus?.isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Network Status Monitor
          </CardTitle>
          <Badge variant={isLiveUpdating ? "outline" : "secondary"}>
            {isLiveUpdating ? (
              <div className="flex items-center gap-2">
                <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
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
            <Skeleton className="h-5 w-2/3" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className={`text-lg font-bold ${networkStatus?.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {networkStatus?.isOnline ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-lg font-bold">{networkStatus?.lastUpdated ? formatTime(networkStatus.lastUpdated) : 'N/A'}</p>
              </div>
            </div>
            
            {stabilityInfo.score !== null && (
              <div className="flex items-center justify-between px-2 py-1.5 bg-muted/50 rounded-md">
                <span className="text-sm">Network Stability:</span>
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    stabilityInfo.rating === 'excellent' ? 'bg-green-100 text-green-800' : 
                    stabilityInfo.rating === 'good' ? 'bg-blue-100 text-blue-800' : 
                    stabilityInfo.rating === 'fair' ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {stabilityInfo.rating}
                </Badge>
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Connection History</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-xs flex items-center gap-1"
                  onClick={() => navigate('/wifi')}
                >
                  <History size={12} />
                  View All
                </Button>
              </div>
              
              {connectionEvents.length > 0 ? (
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {connectionEvents.slice().reverse().slice(0, 5).map((event, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between border-b last:border-b-0">
                      <div className="flex items-center gap-2">
                        {event.status === 'connected' ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm capitalize">{event.status}</span>
                        {/* Display network name if available, otherwise show 'to network' */}
                        <span className="text-xs text-gray-500">
                          to network
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(new Date(event.timestamp))}
                      </span>
                    </div>
                  ))}
                  
                  {connectionEvents.length > 5 && (
                    <div className="p-2 text-center text-sm text-muted-foreground border-t">
                      {connectionEvents.length - 5} more events
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md bg-muted/40">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <p className="text-sm">No connection events recorded</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLiveUpdates}
        >
          {isLiveUpdating ? 'Pause' : 'Resume'} Updates
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
