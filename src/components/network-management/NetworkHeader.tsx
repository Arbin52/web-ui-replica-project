
import React from 'react';
import { RefreshCw, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NetworkHeaderProps {
  isLiveUpdating: boolean;
  toggleLiveUpdates: () => void;
  updateInterval: number;
  handleRefresh: () => void;
  isRefreshing: boolean;
  openAddNetworkDialog: () => void;
}

export const NetworkHeader: React.FC<NetworkHeaderProps> = ({
  isLiveUpdating,
  toggleLiveUpdates,
  updateInterval,
  handleRefresh,
  isRefreshing,
  openAddNetworkDialog
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Network Management</h1>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          <div className={`w-3 h-3 rounded-full ${isLiveUpdating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isLiveUpdating ? `Live (${updateInterval/1000}s)` : 'Manual updates only'}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleLiveUpdates}
          className="flex items-center gap-1"
        >
          {isLiveUpdating ? (
            <>
              <PauseCircle size={16} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <PlayCircle size={16} />
              <span>Auto-update</span>
            </>
          )}
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        <Button 
          onClick={openAddNetworkDialog}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Add Network
        </Button>
      </div>
    </div>
  );
};
