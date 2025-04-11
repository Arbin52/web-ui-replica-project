
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BarChart3 } from 'lucide-react';
import { 
  getConnectionHistory, 
  getConnectionStats,
  getNetworkStabilityRating,
  clearConnectionHistory
} from '@/hooks/network/networkHistoryUtils';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface NetworkHistoryProps {
  onRefresh: () => void;
}

const NetworkHistory: React.FC<NetworkHistoryProps> = ({ onRefresh }) => {
  const [history, setHistory] = React.useState(getConnectionHistory());
  const stats = getConnectionStats();
  const stability = getNetworkStabilityRating();
  
  // Function to format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const handleClearHistory = () => {
    clearConnectionHistory();
    setHistory([]);
    onRefresh();
    toast.success('Connection history cleared');
  };
  
  // Get stability color based on rating
  const getStabilityColor = () => {
    switch (stability.rating) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-amber-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Network Stability Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-500" />
            Network Stability
          </CardTitle>
          <CardDescription>
            Analysis based on connection history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length < 3 ? (
            <div className="text-center py-4 text-muted-foreground">
              Not enough data to analyze stability.
              <p className="text-sm mt-1">Connect to more networks to see statistics.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stability Score</span>
                  <span className="font-medium">{stability.score}/100</span>
                </div>
                <Progress value={stability.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{stability.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Connections</p>
                  <p className="text-xl font-semibold">{stats.totalConnections}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Disconnections</p>
                  <p className="text-xl font-semibold">{stats.disconnections}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Avg. Connection Duration</p>
                  <p className="text-xl font-semibold">
                    {stats.averageConnectionDuration > 0 ? (
                      stats.averageConnectionDuration > 60 ? (
                        `${Math.floor(stats.averageConnectionDuration / 60)} min ${stats.averageConnectionDuration % 60} sec`
                      ) : (
                        `${stats.averageConnectionDuration} seconds`
                      )
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Connection History Card */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Connection History</CardTitle>
            <CardDescription>Recent connection events</CardDescription>
          </div>
          {history.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearHistory}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Network</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[...history]
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((event, idx) => (
                        <tr key={idx} className="hover:bg-muted/40">
                          <td className="px-4 py-2">{formatDate(event.timestamp)}</td>
                          <td className="px-4 py-2">{formatTime(event.timestamp)}</td>
                          <td className="px-4 py-2">{event.ssid}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              event.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {event.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No connection history found.
              <p className="text-sm mt-1">Connection events will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkHistory;
