
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
}

export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  fallbackMessage = "There was an error loading this component",
  onReset
}) => {
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
          <h3 className="font-semibold">{fallbackMessage}</h3>
          <p className="text-sm mt-1">{error.message}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={() => {
              resetErrorBoundary();
              handleReset();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
