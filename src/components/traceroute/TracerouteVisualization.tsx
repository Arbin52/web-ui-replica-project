
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCw, Info } from 'lucide-react';
import { HopResult } from './TracerouteResults';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TracerouteVisualizationProps {
  results: HopResult[];
  isTracing: boolean;
  onTraceAgain: () => void;
}

export const TracerouteVisualization: React.FC<TracerouteVisualizationProps> = ({
  results,
  isTracing,
  onTraceAgain
}) => {
  if (results.length === 0) return null;
  
  const getHopStatusColor = (hop: HopResult) => {
    if (hop.status === 'error' || hop.status === 'timeout') return "bg-red-600";
    
    const avgTime = calculateAverageTime(hop);
    if (!avgTime) return "bg-gray-400";
    if (avgTime < 20) return "bg-green-600";
    if (avgTime < 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  const calculateAverageTime = (hop: HopResult) => {
    const times = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null) as number[];
    if (times.length === 0) return null;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };
  
  const getTimingClass = (hop: HopResult, index: number) => {
    if (hop.status === 'timeout') return "bg-gray-300";
    
    const avgTime = calculateAverageTime(hop);
    if (!avgTime) return "bg-gray-300";
    
    if (index > 0) {
      const prevHop = results[index - 1];
      const prevAvgTime = calculateAverageTime(prevHop);
      
      if (prevAvgTime && avgTime > prevAvgTime * 2) {
        return "bg-red-300";
      }
    }
    
    return "bg-gray-300";
  };
  
  const calculatePacketLoss = (hop: HopResult) => {
    const total = 3; // 3 packets sent per hop
    const received = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null).length;
    return Math.round(((total - received) / total) * 100);
  };
  
  return (
    <>
      <div className="mt-6 border rounded-md p-4 bg-gray-50">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          Route Visualization
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={14} className="ml-1 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Visual representation of network path</p>
            </TooltipContent>
          </Tooltip>
        </h4>
        
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">Source</div>
          <div className="flex-grow flex items-center">
            {results.map((hop, index) => (
              <React.Fragment key={index}>
                <div className="relative group">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`h-3 w-3 rounded-full ${getHopStatusColor(hop)}`}></div>
                    </TooltipTrigger>
                    <TooltipContent className="p-2 max-w-xs">
                      <div className="text-xs">
                        <div className="font-bold">Hop {hop.hop}: {hop.ipAddress}</div>
                        <div>Status: {hop.status}</div>
                        <div>Avg Response: {calculateAverageTime(hop)?.toFixed(2) || "N/A"} ms</div>
                        <div>Packet Loss: {calculatePacketLoss(hop)}%</div>
                        {hop.country && <div>Location: {hop.city}, {hop.country}</div>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {index < results.length - 1 && (
                  <div className={`h-0.5 flex-grow ${getTimingClass(results[index+1], index+1)}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="ml-2 text-gray-500">Target</div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-600 mr-1"></div>
              &lt;20ms
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-yellow-600 mr-1"></div>
              20-50ms
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-600 mr-1"></div>
              &gt;50ms
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-gray-400 mr-1"></div>
              Timeout
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          {results.length} hops, 
          {results[results.length - 1]?.status === 'success' 
            ? ' destination reached' 
            : ' destination not reached'}
        </div>
      </div>
      
      {!isTracing && (
        <div className="mt-4 flex">
          <Button 
            onClick={onTraceAgain}
            variant="outline"
            className="ml-auto"
            size="sm"
          >
            <RotateCw className="mr-1" size={16} />
            Trace Again
          </Button>
        </div>
      )}
    </>
  );
};
