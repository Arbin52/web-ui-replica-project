
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCw } from 'lucide-react';
import { HopResult } from './TracerouteResults';

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
    if (hop.status === 'error' || hop.status === 'timeout') return "text-red-600";
    
    const avgTime = calculateAverageTime(hop);
    if (!avgTime) return "text-gray-400";
    if (avgTime < 20) return "text-green-600";
    if (avgTime < 50) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateAverageTime = (hop: HopResult) => {
    const times = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null) as number[];
    if (times.length === 0) return null;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };
  
  return (
    <>
      <div className="mt-4 border rounded-md p-4 bg-gray-50">
        <h4 className="text-sm font-medium mb-3">Route Visualization</h4>
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">Source</div>
          <div className="flex-grow flex items-center">
            {results.map((hop, index) => (
              <React.Fragment key={index}>
                <div className={`h-3 w-3 rounded-full ${getHopStatusColor(hop)}`}></div>
                {index < results.length - 1 && (
                  <div className="h-0.5 flex-grow bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="ml-2 text-gray-500">Target</div>
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
