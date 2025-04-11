
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, BarChart as BarChartIcon, Activity, Map } from 'lucide-react';
import { HopResult } from './TracerouteResults';
import { calculateAverageResponseTime } from './utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TracerouteAnalysisProps {
  results: HopResult[];
  networkMetrics: {
    totalHops: number;
    timeoutPercentage: string;
    avgLatency: string;
    maxLatency: string;
    maxLatencyHop: number | string;
  };
  routeClassification: string;
  anomalies: {
    hop: number;
    type: string;
    message: string;
  }[];
}

export const TracerouteAnalysis: React.FC<TracerouteAnalysisProps> = ({
  results,
  networkMetrics,
  routeClassification,
  anomalies
}) => {
  // Prepare data for charts
  const latencyData = results.map(hop => ({
    hop: hop.hop,
    avg: calculateAverageResponseTime([hop.responseTime1, hop.responseTime2, hop.responseTime3]) || 0
  }));
  
  const getRouteClassBadge = () => {
    switch (routeClassification) {
      case 'Optimal':
        return <Badge className="bg-green-500">Optimal</Badge>;
      case 'Normal':
        return <Badge className="bg-blue-500">Normal</Badge>;
      case 'High Latency':
        return <Badge className="bg-yellow-500">High Latency</Badge>;
      case 'Unstable':
        return <Badge className="bg-red-500">Unstable</Badge>;
      case 'Incomplete':
        return <Badge className="bg-gray-500">Incomplete</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getAnomalyBadge = (type: string) => {
    switch (type) {
      case 'timeout':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Timeout</Badge>;
      case 'latency_spike':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Latency Spike</Badge>;
      case 'high_jitter':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">High Jitter</Badge>;
      default:
        return <Badge variant="outline">Issue</Badge>;
    }
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Activity size={18} className="text-primary" />
        Network Path Analysis
      </h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex flex-wrap gap-4 md:gap-8 justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Route Classification</div>
            <div className="font-semibold flex items-center">
              {getRouteClassBadge()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Hops</div>
            <div className="font-semibold">{networkMetrics.totalHops}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Avg Latency</div>
            <div className="font-semibold">{networkMetrics.avgLatency} ms</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Max Latency</div>
            <div className="font-semibold">{networkMetrics.maxLatency} ms (hop {networkMetrics.maxLatencyHop})</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Timeout Rate</div>
            <div className="font-semibold">{networkMetrics.timeoutPercentage}%</div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="latency">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="latency" className="flex items-center gap-2">
            <BarChartIcon size={14} /> Latency Analysis
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertCircle size={14} /> Anomalies
          </TabsTrigger>
          <TabsTrigger value="geopath" className="flex items-center gap-2">
            <Map size={14} /> Geographic Path
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="latency">
          <Card>
            <CardHeader>
              <CardTitle>Hop Latency Distribution</CardTitle>
              <CardDescription>Average response time per hop in milliseconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hop" label={{ value: 'Hop Number', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip 
                      formatter={(value: any) => [`${value} ms`, 'Avg Latency']}
                      labelFormatter={(label) => `Hop ${label}`}
                    />
                    <Bar 
                      dataKey="avg" 
                      name="Avg Latency" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Network Anomalies</CardTitle>
              <CardDescription>Detected issues along the network path</CardDescription>
            </CardHeader>
            <CardContent>
              {anomalies.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  <AlertCircle className="mx-auto mb-2 text-green-500" size={24} />
                  <p>No anomalies detected - network path appears normal</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {anomalies.map((anomaly, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                      <div className="mt-1">
                        {getAnomalyBadge(anomaly.type)}
                      </div>
                      <div>
                        <div className="font-medium">Issue at Hop {anomaly.hop}</div>
                        <div className="text-sm text-gray-600">{anomaly.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="geopath">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Path</CardTitle>
              <CardDescription>Network path through geographic locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((hop, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                      {hop.hop}
                    </div>
                    <div className="ml-2 flex-grow">
                      <div className="h-0.5 bg-gray-200"></div>
                    </div>
                    <div className="ml-2 flex items-center bg-gray-50 rounded-md px-3 py-1.5 text-sm">
                      {hop.city && hop.country ? (
                        <span>{hop.city}, {hop.country}</span>
                      ) : (
                        <span className="text-gray-400">Unknown location</span>
                      )}
                      {hop.isp && (
                        <span className="ml-2 text-gray-500 text-xs">({hop.isp})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
