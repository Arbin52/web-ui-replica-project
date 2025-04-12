
import React from 'react';

export const RealTimeIndicator: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-1">
      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-xs text-muted-foreground">Live</span>
    </div>
  );
};
