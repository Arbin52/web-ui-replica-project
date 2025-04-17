
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, History } from 'lucide-react';
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

// Format time efficiently
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

export const NetworkStatusMonitor: React.FC<NetworkStatusMonitorProps> = React.memo(({
  networkStatus,
  isLoading,
  isLiveUpdating,
  toggleLiveUpdates,
  refreshNetworkStatus,
  updateInterval
}) => {
  const navigate = useNavigate();
  
  // Get connection history events (limit to 5 to improve performance)
  const connectionEvents = networkStatus?.connectionHistory?.slice(0, 5) || [];
  
  // Get network stability info
  const stabilityInfo = getNetworkStabilityRating();

  // Simplify the component to improve performance
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {navigator.onLine ? (
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
                <p className={`text-lg font-bold ${navigator.onLine ? 'text-green-600' : 'text-red-600'}`}>
                  {navigator.onLine ? 'Connected' : 'Disconnected'}
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
            
            {/* Only show connection history if we have any */}
            {connectionEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Recent Connections</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => navigate('/wifi')}
                  >
                    <History size={12} className="mr-1" />
                    View All
                  </Button>
                </div>
                
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {connectionEvents.map((event, idx) => (
                    <div key={idx} className="p-1.5 flex items-center justify-between border-b last:border-b-0 text-sm">
                      <div className="flex items-center gap-2">
                        {event.status === 'connected' ? (
                          <Wifi className="h-3 w-3 text-green-500" />
                        ) : (
                          <WifiOff className="h-3 w-3 text-red-500" />
                        )}
                        <span className="capitalize">{event.status}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {typeof event.timestamp === 'string' 
                          ? formatTime(new Date(event.timestamp)) 
                          : formatTime(event.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
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
});

export default NetworkStatusMonitor;
