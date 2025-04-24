
import React from 'react';
import { Info, RefreshCw, AlertTriangle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
  handleRefresh: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, handleRefresh }) => {
  // Check if error is related to network scanner
  const isNetworkScannerError = error.includes('Network scanner not available');
  
  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Info size={24} className="text-amber-500" />
        <h2 className="text-xl font-bold">Network Overview</h2>
      </div>
      
      {isNetworkScannerError ? (
        <Alert className="bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-md">
          <AlertTriangle className="h-5 w-5 text-amber-500 mb-2" />
          <AlertDescription className="space-y-4">
            <p className="font-medium">Network scanner is not available.</p>
            <p>To use real-time network data, start the local scanner service:</p>
            <div className="bg-gray-800 text-green-400 p-3 rounded-md font-mono text-sm overflow-x-auto">
              <p className="mb-1"><Terminal size={14} className="inline mr-2" />cd local-scanner</p>
              <p className="mb-1"><Terminal size={14} className="inline mr-2" />node setup-scanner.js</p>
              <p><Terminal size={14} className="inline mr-2" />npm start</p>
            </div>
            <p>Don't worry! The application will automatically use simulated data for now.</p>
            <Button 
              onClick={handleRefresh} 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2"
              size="lg"
            >
              <RefreshCw size={18} className="mr-2" />
              Retry or Continue with Simulated Data
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
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
      )}
    </div>
  );
};
