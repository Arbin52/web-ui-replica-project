
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Signal, Map, FileBarChart, Wifi, Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NetworkStatus } from '@/hooks/network/types';

interface FeatureCardsProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ networkStatus, isLoading }) => {
  const navigate = useNavigate();

  // Function to navigate to specific feature pages
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Speed Test Mini Card */}
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/speed')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            Speed Test
          </CardTitle>
          <CardDescription>Network performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Download</p>
              <p className="text-xl font-semibold">{networkStatus?.connectionSpeed.download || '--'} Mbps</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upload</p>
              <p className="text-xl font-semibold">{networkStatus?.connectionSpeed.upload || '--'} Mbps</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">Run Test</Button>
        </CardContent>
      </Card>
      
      {/* Ping Mini Card */}
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/ping')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Signal size={18} className="text-green-500" />
            Ping Status
          </CardTitle>
          <CardDescription>Connection latency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold mb-2">{networkStatus?.connectionSpeed.latency || '--'} ms</div>
            <Progress value={networkStatus?.connectionSpeed.latency ? 
              Math.max(0, Math.min(100, 100 - networkStatus.connectionSpeed.latency * 2)) : 0} 
              className="h-2 w-full" />
            <p className="text-xs mt-1 text-muted-foreground">
              {networkStatus?.connectionSpeed.latency && networkStatus.connectionSpeed.latency < 20 ? 'Excellent' : 
               networkStatus?.connectionSpeed.latency && networkStatus.connectionSpeed.latency < 50 ? 'Good' : 'Poor'} latency
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Traceroute Mini Card */}
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/traceroute')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Map size={18} className="text-purple-500" />
            Traceroute
          </CardTitle>
          <CardDescription>Network path analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                  <div className="h-[2px] w-12 bg-gray-200 mt-1"></div>
                  <div className="text-xs text-gray-500 mt-1">Hop {i+1}</div>
                </div>
              ))}
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">Trace Route</Button>
        </CardContent>
      </Card>
      
      {/* WiFi Analysis Mini Card */}
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/wifi')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Wifi size={18} className="text-blue-500" />
            WiFi Management
          </CardTitle>
          <CardDescription>Manage connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">Connected to</p>
            <p className="font-semibold">{networkStatus?.networkName || 'Not connected'}</p>
            <div className="flex items-center mt-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`ml-1 h-${i+2} w-1 rounded-sm ${
                  i < (networkStatus?.signalStrength === 'Good' ? 4 : 
                       networkStatus?.signalStrength === 'Fair' ? 3 : 2) ? 
                  'bg-blue-500' : 'bg-gray-300'
                }`}></div>
              ))}
              <span className="ml-2 text-xs">
                {networkStatus?.signalStrength || 'Unknown'}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">Manage WiFi</Button>
        </CardContent>
      </Card>
      
      {/* Reports Mini Card */}
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/reports')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileBarChart size={18} className="text-amber-500" />
            Network Reports
          </CardTitle>
          <CardDescription>Usage analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-12 flex items-end mb-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 mx-0.5">
                <div 
                  className="bg-amber-500 ml-auto" 
                  style={{ height: `${Math.floor(Math.random() * 100)}%`, width: '100%' }}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">Last 7 days network usage</p>
          <Button variant="outline" size="sm" className="w-full mt-2">View Reports</Button>
        </CardContent>
      </Card>
      
      {/* Network Management Mini Card */}
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/networks')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Network size={18} className="text-indigo-500" />
            Network Management
          </CardTitle>
          <CardDescription>Devices & settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <div className="text-sm">
              <p className="text-muted-foreground">Connected devices</p>
              <p className="font-semibold">{networkStatus?.connectedDevices.length || 0}</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Network status</p>
              <p className={`font-semibold ${networkStatus?.isOnline ? 'text-green-500' : 'text-red-500'}`}>
                {networkStatus?.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">Manage Network</Button>
        </CardContent>
      </Card>
    </div>
  );
};
