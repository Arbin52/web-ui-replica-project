
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  handleRefresh: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, handleRefresh }) => {
  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Info size={24} />
        <h2 className="text-xl font-bold">Network Overview</h2>
      </div>
      
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <span className="font-bold">Error:</span>
          <span>{error}</span>
        </div>
        <Button onClick={handleRefresh} className="mt-2 bg-red-100 text-red-700 hover:bg-red-200">
          Try Again
        </Button>
      </div>
    </div>
  );
};
