
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface TracerouteProgressProps {
  isTracing: boolean;
  progress: number;
  targetHost: string;
  hopsDiscovered: number;
}

export const TracerouteProgress: React.FC<TracerouteProgressProps> = ({
  isTracing,
  progress,
  targetHost,
  hopsDiscovered
}) => {
  if (!isTracing) return null;
  
  return (
    <div className="my-4">
      <Progress value={progress} className="h-2 mb-2" />
      <div className="text-center text-sm text-gray-500">
        Tracing route to {targetHost}... ({hopsDiscovered} hops discovered)
      </div>
    </div>
  );
};
