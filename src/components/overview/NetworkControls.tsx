
import React from 'react';
import { PauseCircle, PlayCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NetworkControlsProps {
  isLoading: boolean;
  isLiveUpdating: boolean;
  updateInterval: number;
  toggleLiveUpdates: () => void;
  setRefreshRate: (ms: number) => void;
  handleRefresh: () => void;
}

export const NetworkControls: React.FC<NetworkControlsProps> = ({
  isLoading,
  isLiveUpdating,
  updateInterval,
  toggleLiveUpdates,
  setRefreshRate,
  handleRefresh
}) => {
  // Handler to log interval changes
  const handleIntervalChange = (value: string) => {
    const ms = parseInt(value);
    console.log(`NetworkControls - changing interval to ${ms}ms`);
    setRefreshRate(ms);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={updateInterval.toString()}
        onValueChange={handleIntervalChange}
        disabled={!isLiveUpdating || isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Refresh Rate" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10000">Every 10 seconds</SelectItem>
          <SelectItem value="30000">Every 30 seconds</SelectItem>
          <SelectItem value="60000">Every minute</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        variant="outline" 
        className="flex items-center gap-1" 
        onClick={toggleLiveUpdates}
      >
        {isLiveUpdating ? (
          <>
            <PauseCircle size={16} />
            <span>Pause</span>
          </>
        ) : (
          <>
            <PlayCircle size={16} />
            <span>Resume</span>
          </>
        )}
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-1" 
        onClick={handleRefresh}
        disabled={isLoading}
      >
        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        <span>Refresh</span>
      </Button>
    </div>
  );
};
