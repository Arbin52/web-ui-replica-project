
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, BarChart as BarChartIcon } from 'lucide-react';
import { HopResult } from './TracerouteResults';
import { calculateAverageResponseTime } from './utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TracerouteComparisonProps {
  currentResults: HopResult[];
  previousResults?: HopResult[] | null;
}

export const TracerouteComparison: React.FC<TracerouteComparisonProps> = ({
  currentResults,
  previousResults
}) => {
  const [chartType, setChartType] = useState<'latency' | 'timeouts'>('latency');
  
  if (!previousResults || previousResults.length === 0) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChartIcon size={18} className="text-primary" />
          <h3 className="text-lg font-semibold">Comparison</h3>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <AlertCircle className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-gray-600">No previous trace data available for comparison</p>
          <p className="text-sm text-gray-500 mt-1">Run another trace to enable comparison</p>
        </div>
      </div>
    );
  }

  // Prepare data for chart comparison
  const prepareLatencyData = () => {
    const maxHops = Math.max(
      currentResults.length,
      previousResults ? previousResults.length : 0
    );
    
    return Array.from({ length: maxHops }, (_, i) => {
      const currentHop = currentResults[i];
      const previousHop = previousResults?.[i];
      
      return {
        hop: i + 1,
        current: currentHop ? calculateAverageResponseTime([
          currentHop.responseTime1, 
          currentHop.responseTime2, 
          currentHop.responseTime3
        ]) : null,
        previous: previousHop ? calculateAverageResponseTime([
          previousHop.responseTime1, 
          previousHop.responseTime2, 
          previousHop.responseTime3
        ]) : null
      };
    });
  };
  
  const prepareTimeoutData = () => {
    const maxHops = Math.max(
      currentResults.length,
      previousResults ? previousResults.length : 0
    );
    
    return Array.from({ length: maxHops }, (_, i) => {
      const currentHop = currentResults[i];
      const previousHop = previousResults?.[i];
      
      const currentTimeouts = currentHop ? [
        currentHop.responseTime1 === null ? 1 : 0,
        currentHop.responseTime2 === null ? 1 : 0,
        currentHop.responseTime3 === null ? 1 : 0
      ].reduce((sum, val) => sum + val, 0) : 0;
      
      const previousTimeouts = previousHop ? [
        previousHop.responseTime1 === null ? 1 : 0,
        previousHop.responseTime2 === null ? 1 : 0,
        previousHop.responseTime3 === null ? 1 : 0
      ].reduce((sum, val) => sum + val, 0) : 0;
      
      return {
        hop: i + 1,
        current: currentTimeouts,
        previous: previousTimeouts
      };
    });
  };
  
  const chartData = chartType === 'latency' ? prepareLatencyData() : prepareTimeoutData();
  
  // Calculate overall statistics for comparison
  const calculateStats = (results: HopResult[]) => {
    let totalLatency = 0;
    let validMeasurements = 0;
    let timeouts = 0;
    let total = 0;
    
    results.forEach(hop => {
      [hop.responseTime1, hop.responseTime2, hop.responseTime3].forEach(resp => {
        total++;
        if (resp === null) {
          timeouts++;
        } else {
          totalLatency += resp;
          validMeasurements++;
        }
      });
    });
    
    const avgLatency = validMeasurements > 0 ? totalLatency / validMeasurements : 0;
    const packetLoss = (timeouts / total) * 100;
    
    return {
      avgLatency: avgLatency.toFixed(2),
      packetLoss: packetLoss.toFixed(1),
      totalHops: results.length
    };
  };
  
  const currentStats = calculateStats(currentResults);
  const previousStats = calculateStats(previousResults);
  
  // Calculate differences
  const latencyDiff = (parseFloat(currentStats.avgLatency) - parseFloat(previousStats.avgLatency)).toFixed(2);
  const packetLossDiff = (parseFloat(currentStats.packetLoss) - parseFloat(previousStats.packetLoss)).toFixed(1);
  const hopsDiff = currentStats.totalHops - previousStats.totalHops;
  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChartIcon size={18} className="text-primary" />
        <h3 className="text-lg font-semibold">Comparative Analysis</h3>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current vs Previous Trace</CardTitle>
          <CardDescription>
            Compare with the previous traceroute results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-md">
            <div>
              <div className="text-sm text-gray-500">Avg Latency</div>
              <div className="font-semibold">{currentStats.avgLatency} ms</div>
              <div className={`text-xs ${Number(latencyDiff) < 0 ? 'text-green-600' : Number(latencyDiff) > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {Number(latencyDiff) === 0 ? 'No change' : 
                Number(latencyDiff) < 0 ? `↓ ${Math.abs(Number(latencyDiff))} ms` : 
                `↑ ${latencyDiff} ms`}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Packet Loss</div>
              <div className="font-semibold">{currentStats.packetLoss}%</div>
              <div className={`text-xs ${Number(packetLossDiff) < 0 ? 'text-green-600' : Number(packetLossDiff) > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {Number(packetLossDiff) === 0 ? 'No change' : 
                Number(packetLossDiff) < 0 ? `↓ ${Math.abs(Number(packetLossDiff))}%` : 
                `↑ ${packetLossDiff}%`}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Hop Count</div>
              <div className="font-semibold">{currentStats.totalHops}</div>
              <div className={`text-xs ${hopsDiff < 0 ? 'text-green-600' : hopsDiff > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {hopsDiff === 0 ? 'No change' : 
                hopsDiff < 0 ? `↓ ${Math.abs(hopsDiff)} hops` : 
                `↑ ${hopsDiff} hops`}
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="latency" className="w-full" onValueChange={(value) => setChartType(value as 'latency' | 'timeouts')}>
            <TabsList className="mb-4">
              <TabsTrigger value="latency">Latency Comparison</TabsTrigger>
              <TabsTrigger value="timeouts">Timeouts Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="latency">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hop" label={{ value: 'Hop Number', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip 
                      formatter={(value: any, name: string) => [value ? `${value} ms` : 'N/A', name === 'current' ? 'Current Trace' : 'Previous Trace']}
                      labelFormatter={(label) => `Hop ${label}`}
                    />
                    <Legend formatter={(value) => value === 'current' ? 'Current Trace' : 'Previous Trace'} />
                    <Bar dataKey="previous" name="previous" fill="#94a3b8" barSize={20} />
                    <Bar dataKey="current" name="current" fill="#3b82f6" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="timeouts">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hop" label={{ value: 'Hop Number', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Timeouts (count)', angle: -90, position: 'insideLeft' }} domain={[0, 3]} />
                    <RechartsTooltip 
                      formatter={(value: any, name: string) => [value, name === 'current' ? 'Current Trace' : 'Previous Trace']}
                      labelFormatter={(label) => `Hop ${label}`}
                    />
                    <Legend formatter={(value) => value === 'current' ? 'Current Trace' : 'Previous Trace'} />
                    <Bar dataKey="previous" name="previous" fill="#94a3b8" barSize={20} />
                    <Bar dataKey="current" name="current" fill="#ef4444" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
