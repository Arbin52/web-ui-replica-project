
import React, { memo } from 'react';
import { Activity } from 'lucide-react';
import OptimizedFeatureCard from '../OptimizedFeatureCard';

interface SpeedTestCardProps {
  downloadSpeed: number | undefined;
  uploadSpeed: number | undefined;
}

const SpeedTestCard: React.FC<SpeedTestCardProps> = ({ downloadSpeed, uploadSpeed }) => {
  return (
    <OptimizedFeatureCard 
      icon={<Activity size={18} className="text-blue-500" />}
      title="Speed Test"
      description="Network performance"
      path="/speed"
      buttonText="Run Test"
    >
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
    </OptimizedFeatureCard>
  );
};

export default memo(SpeedTestCard);
