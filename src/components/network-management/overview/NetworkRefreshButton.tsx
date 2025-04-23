
import React from 'react';
import { Button } from "@/components/ui/button";
import { Signal } from 'lucide-react';

interface NetworkRefreshButtonProps {
  isRefreshing: boolean;
  handleRefresh: () => void;
  label?: string; // Added optional label prop
}

export const NetworkRefreshButton: React.FC<NetworkRefreshButtonProps> = ({
  isRefreshing,
  handleRefresh,
  label
}) => {
  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh}
      className="w-full mt-2 hover:bg-primary/5"
      disabled={isRefreshing}
    >
      <div className="flex items-center">
        <Signal className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : label || 'Refresh Network Data'}
      </div>
    </Button>
  );
};
