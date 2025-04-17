
import React, { memo, useCallback } from 'react';
import { Activity } from 'lucide-react';
import OptimizedFeatureCard from '../OptimizedFeatureCard';
import { preventRapidExecution } from '@/utils/performance';

interface SpeedTestCardProps {
  downloadSpeed: number | undefined;
  uploadSpeed: number | undefined;
}

const SpeedTestCard: React.FC<SpeedTestCardProps> = ({ downloadSpeed, uploadSpeed }) => {
  // Pre-format speed values to prevent calculations during render
  const displayDownload = downloadSpeed !== undefined ? 
    parseFloat(downloadSpeed.toFixed(1)) : '--';
  const displayUpload = uploadSpeed !== undefined ? 
    parseFloat(uploadSpeed.toFixed(1)) : '--';

  return (
    <OptimizedFeatureCard 
      icon={<Activity size={18} className="text-blue-500" />}
      title="Speed Test"
      description="Network performance"
      path="/speed"
      buttonText="Run Test"
      priority="low"
    >
      <div className="flex justify-between mb-2">
        <div>
          <p className="text-sm text-muted-foreground">Download</p>
          <p className="text-xl font-semibold">{displayDownload} Mbps</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Upload</p>
          <p className="text-xl font-semibold">{displayUpload} Mbps</p>
        </div>
      </div>
    </OptimizedFeatureCard>
  );
};

export default memo(SpeedTestCard);
