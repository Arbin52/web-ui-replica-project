
import React, { memo } from 'react';
import { Signal } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import OptimizedFeatureCard from '../OptimizedFeatureCard';

interface PingStatusCardProps {
  latency: number | undefined;
}

const PingStatusCard: React.FC<PingStatusCardProps> = ({ latency }) => {
  // Pre-calculate latency metrics
  const latencyQuality = latency ? 
    (latency < 20 ? 'Excellent' : latency < 50 ? 'Good' : 'Poor') : 'Unknown';
  
  const progressValue = latency ? 
    Math.max(0, Math.min(100, 100 - latency * 2)) : 0;

  return (
    <OptimizedFeatureCard
      icon={<Signal size={18} className="text-green-500" />}
      title="Ping Status"
      description="Connection latency"
      path="/ping"
    >
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold mb-2">{latency || '--'} ms</div>
        <Progress value={progressValue} className="h-2 w-full" />
        <p className="text-xs mt-1 text-muted-foreground">
          {latencyQuality} latency
        </p>
      </div>
    </OptimizedFeatureCard>
  );
};

export default memo(PingStatusCard);
