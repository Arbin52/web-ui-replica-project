
import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading network information...</p>
        </div>
      </div>
    </div>
  );
};
