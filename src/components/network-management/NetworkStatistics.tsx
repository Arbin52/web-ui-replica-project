
import React from 'react';
import { BarChart, Zap, Activity, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NetworkStatus } from '@/hooks/network/types';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface NetworkStatisticsProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const NetworkStatistics: React.FC<NetworkStatisticsProps> = ({ networkStatus, isLoading }) => {
  // Mock data for network usage over time (would be real data in a production app)
  const hourlyData = [
    { name: '00:00', download: 120, upload: 85 },
    { name: '01:00', download: 80, upload: 45 },
    { name: '02:00', download: 40, upload: 20 },
    { name: '03:00', download: 30, upload: 15 },
    { name: '04:00', download: 25, upload: 10 },
    { name: '05:00', download: 35, upload: 25 },
    { name: '06:00', download: 90, upload: 60 },
    { name: '07:00', download: 150, upload: 80 },
    { name: '08:00', download: 220, upload: 120 },
    { name: '09:00', download: 280, upload: 150 },
    { name: '10:00', download: 310, upload: 170 },
    { name: '11:00', download: 350, upload: 200 },
  ];

  // Mock data for connection quality over time
  const qualityData = [
    { name: '00:00', latency: 25, packetLoss: 0 },
    { name: '01:00', latency: 28, packetLoss: 0 },
    { name: '02:00', latency: 22, packetLoss: 0 },
    { name: '03:00', latency: 20, packetLoss: 0 },
    { name: '04:00', latency: 23, packetLoss: 0 },
    { name: '05:00', latency: 26, packetLoss: 0.5 },
    { name: '06:00', latency: 30, packetLoss: 1 },
    { name: '07:00', latency: 45, packetLoss: 2 },
    { name: '08:00', latency: 60, packetLoss: 5 },
    { name: '09:00', latency: 40, packetLoss: 1 },
    { name: '10:00', latency: 30, packetLoss: 0.5 },
    { name: '11:00', latency: 25, packetLoss: 0 },
  ];

  // Mock data for device connection counts by hour
  const deviceConnectionData = [
    { name: '00:00', devices: 3 },
    { name: '01:00', devices: 3 },
    { name: '02:00', devices: 3 },
    { name: '03:00', devices: 3 },
    { name: '04:00', devices: 3 },
    { name: '05:00', devices: 4 },
    { name: '06:00', devices: 5 },
    { name: '07:00', devices: 6 },
    { name: '08:00', devices: 8 },
    { name: '09:00', devices: 12 },
    { name: '10:00', devices: 12 },
    { name: '11:00', devices: 10 },
  ];

  // Speed format helper
  const formatSpeed = (value: number) => {
    return value < 1000 ? `${value} Mbps` : `${(value / 1000).toFixed(1)} Gbps`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart size={18} className="text-primary" />
            <CardTitle>Network Statistics</CardTitle>
          </div>
          <CardDescription>
            View detailed analytics about your network performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Data Usage Chart */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Zap size={16} className="text-blue-500" />
                Data Usage (Last 12 Hours)
              </h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={hourlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value} MB`} />
                    <Tooltip formatter={(value) => [`${value} MB`, undefined]} />
                    <Legend />
                    <Bar dataKey="download" name="Download" fill="#3498db" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="upload" name="Upload" fill="#2ecc71" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Last 12 hours</span>
                <span>
                  Total: {networkStatus?.dataUsage ? `${(networkStatus.dataUsage.total / 1000).toFixed(2)} GB` : '0 GB'}
                </span>
              </div>
            </div>

            {/* Connection Quality Chart */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Activity size={16} className="text-yellow-500" />
                Connection Quality
              </h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={qualityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value} ms`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="latency" name="Latency" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="packetLoss" name="Packet Loss %" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Last 12 hours</span>
                <span>
                  Current Latency: {networkStatus?.connectionSpeed.latency || 0} ms
                </span>
              </div>
            </div>

            {/* Connected Devices Chart */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock size={16} className="text-purple-500" />
                Connected Devices Over Time
              </h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={deviceConnectionData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="devices" name="Connected Devices" fill="#9b59b6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Last 12 hours</span>
                <span>
                  Current Devices: {networkStatus?.connectedDevices?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
