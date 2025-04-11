
import React from 'react';
import { Route } from 'lucide-react';

interface TracerouteEmptyStateProps {
  isTracing: boolean;
}

export const TracerouteEmptyState: React.FC<TracerouteEmptyStateProps> = ({
  isTracing
}) => {
  if (isTracing) return null;
  
  return (
    <div className="text-center py-8">
      <Route size={48} className="text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-600 mb-1">No Traceroute Results Yet</h3>
      <p className="text-sm text-gray-500">Enter a host above and click 'Start Trace' to map the network path</p>
    </div>
  );
};
