
import React, { memo } from 'react';
import { Map } from 'lucide-react';
import OptimizedFeatureCard from '../OptimizedFeatureCard';

const TracerouteCard: React.FC = () => {
  return (
    <OptimizedFeatureCard
      icon={<Map size={18} className="text-purple-500" />}
      title="Traceroute"
      description="Network path analysis"
      path="/traceroute"
      buttonText="Trace Route"
      priority="medium"
    >
      <div className="flex items-center justify-center p-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
              <div className="h-[2px] w-12 bg-gray-200 mt-1"></div>
              <div className="text-xs text-gray-500 mt-1">Hop {i+1}</div>
            </div>
          ))}
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </OptimizedFeatureCard>
  );
};

export default memo(TracerouteCard);
