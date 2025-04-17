
import React, { memo } from 'react';
import { FileBarChart } from 'lucide-react';
import OptimizedFeatureCard from '../OptimizedFeatureCard';

const ReportsCard: React.FC = () => {
  // Pre-calculate random heights
  const barHeights = Array(7).fill(0).map((_, i) => 
    30 + (i * 5) + (Math.floor(Math.random() * 30)));

  return (
    <OptimizedFeatureCard
      icon={<FileBarChart size={18} className="text-amber-500" />}
      title="Network Reports"
      description="Usage analytics"
      path="/reports"
      buttonText="View Reports"
    >
      <div className="h-12 flex items-end mb-2">
        {barHeights.map((height, i) => (
          <div key={i} className="flex-1 mx-0.5">
            <div 
              className="bg-amber-500 ml-auto" 
              style={{ height: `${height}%`, width: '100%' }}
            ></div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">Last 7 days network usage</p>
    </OptimizedFeatureCard>
  );
};

export default memo(ReportsCard);
