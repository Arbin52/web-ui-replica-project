
import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NetworkStatus } from '@/hooks/network/types';

interface NetworkDiagnosticsProps {
  networkStatus: NetworkStatus | null;
}

const NetworkDiagnostics: React.FC<NetworkDiagnosticsProps> = ({ networkStatus }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity size={18} />
          Network Diagnostics
        </CardTitle>
        <CardDescription>
          Tools to analyze and troubleshoot your network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Network Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">{networkStatus?.connectionSpeed.latency || "--"}</div>
                <div className="text-sm text-gray-500">ms</div>
              </div>
              <div className={`text-xs ${networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 20 ? 'text-green-500' : networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 20 ? 'Excellent' : 
                networkStatus?.connectionSpeed.latency && networkStatus?.connectionSpeed.latency < 50 ? 'Good' : 
                networkStatus?.connectionSpeed.latency ? 'Poor' : 'Unknown'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Network Stability</CardTitle>
            </CardHeader>
            <CardContent>
              {networkStatus?.connectionHistory && networkStatus.connectionHistory.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {networkStatus.connectionHistory.slice(-10).map((event, i) => (
                      <div 
                        key={i}
                        className={`flex-1 h-8 ${event.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Last 10 connection events</span>
                    <span>Now</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-4 text-gray-500">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  No connection data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="diagnostic-tools">Diagnostic Tools</Label>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Run Speed Test</Button>
            <Button variant="outline" size="sm">Ping Gateway</Button>
            <Button variant="outline" size="sm">Check DNS</Button>
            <Button variant="outline" size="sm">View Connection Log</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkDiagnostics;
