
import React, { memo, useCallback } from 'react';
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

// Create individual card components to prevent unnecessary re-renders
const SpeedTestCard = memo(({ downloadSpeed, uploadSpeed, navigate }: { 
  downloadSpeed: number | undefined, 
  uploadSpeed: number | undefined,
  navigate: (path: string) => void
}) => (
  <Card 
    className="hover:shadow-md transition-shadow" 
    onClick={() => navigate('/speed')}
  >
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
          <p className="text-xl font-semibold">{downloadSpeed || '--'} Mbps</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Upload</p>
          <p className="text-xl font-semibold">{uploadSpeed || '--'} Mbps</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full mt-2">Run Test</Button>
    </CardContent>
  </Card>
));

const PingStatusCard = memo(({ latency, navigate }: { 
  latency: number | undefined,
  navigate: (path: string) => void
}) => (
  <Card 
    className="hover:shadow-md transition-shadow" 
    onClick={() => navigate('/ping')}
  >
    <CardHeader className="pb-2">
      <CardTitle className="text-base flex items-center gap-2">
        <Signal size={18} className="text-green-500" />
        Ping Status
      </CardTitle>
      <CardDescription>Connection latency</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold mb-2">{latency || '--'} ms</div>
        <Progress 
          value={latency ? Math.max(0, Math.min(100, 100 - latency * 2)) : 0} 
          className="h-2 w-full" 
        />
        <p className="text-xs mt-1 text-muted-foreground">
          {latency && latency < 20 ? 'Excellent' : 
           latency && latency < 50 ? 'Good' : 'Poor'} latency
        </p>
      </div>
    </CardContent>
  </Card>
));

const TracerouteCard = memo(({ navigate }: { navigate: (path: string) => void }) => (
  <Card 
    className="hover:shadow-md transition-shadow" 
    onClick={() => navigate('/traceroute')}
  >
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
));

const WifiManagementCard = memo(({ networkName, signalStrength, navigate }: { 
  networkName: string | undefined, 
  signalStrength: string | undefined,
  navigate: (path: string) => void
}) => (
  <Card 
    className="hover:shadow-md transition-shadow" 
    onClick={() => navigate('/wifi')}
  >
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
        <p className="font-semibold">{networkName || 'Not connected'}</p>
        <div className="flex items-center mt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`ml-1 h-${i+2} w-1 rounded-sm ${
              i < (signalStrength === 'Good' ? 4 : 
                   signalStrength === 'Fair' ? 3 : 2) ? 
              'bg-blue-500' : 'bg-gray-300'
            }`}></div>
          ))}
          <span className="ml-2 text-xs">
            {signalStrength || 'Unknown'}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full">Manage WiFi</Button>
    </CardContent>
  </Card>
));

export const FeatureCards: React.FC<FeatureCardsProps> = ({ networkStatus, isLoading }) => {
  const navigate = useNavigate();

  // Memoize navigation function to prevent recreating on each render
  const navigateTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Skip rendering if loading or no data to prevent UI jumping
  if (isLoading && !networkStatus) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="opacity-50">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 mt-1"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Speed Test Mini Card */}
      <SpeedTestCard 
        downloadSpeed={networkStatus?.connectionSpeed.download}
        uploadSpeed={networkStatus?.connectionSpeed.upload}
        navigate={navigateTo}
      />
      
      {/* Ping Mini Card */}
      <PingStatusCard
        latency={networkStatus?.connectionSpeed.latency}
        navigate={navigateTo}
      />
      
      {/* Traceroute Mini Card */}
      <TracerouteCard navigate={navigateTo} />
      
      {/* WiFi Analysis Mini Card */}
      <WifiManagementCard
        networkName={networkStatus?.networkName}
        signalStrength={networkStatus?.signalStrength}
        navigate={navigateTo}
      />
      
      {/* Reports Mini Card */}
      <Card className="hover:shadow-md transition-shadow" onClick={() => navigateTo('/reports')}>
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
                  style={{ 
                    height: `${Math.floor(30 + (i * 5) + (Math.random() * 30))}%`, 
                    width: '100%' 
                  }}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">Last 7 days network usage</p>
          <Button variant="outline" size="sm" className="w-full mt-2">View Reports</Button>
        </CardContent>
      </Card>
      
      {/* Network Management Mini Card */}
      <Card className="hover:shadow-md transition-shadow" onClick={() => navigateTo('/networks')}>
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
              <p className="font-semibold">{networkStatus?.connectedDevices?.length || 0}</p>
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

export default memo(FeatureCards);
