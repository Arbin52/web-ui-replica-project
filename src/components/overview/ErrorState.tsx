
import React from 'react';
import { Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  handleRefresh: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, handleRefresh }) => {
  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Info size={24} className="text-amber-500" />
        <h2 className="text-xl font-bold">Network Overview</h2>
      </div>
      
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-md flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-4 text-center">
          <span className="font-bold">Error:</span>
          <span>{error}</span>
        </div>
        <Button 
          onClick={handleRefresh} 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
          size="lg"
        >
          <RefreshCw size={18} className="mr-2" />
          Try Again
        </Button>
        <p className="text-sm mt-4 text-gray-600 max-w-md text-center">
          This might happen if the network scanner is unavailable. The application will automatically use simulated data after a few retries.
        </p>
      </div>
    </div>
  );
};
