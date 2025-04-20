
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
  const handleIntervalChange = (value: string) => {
    const ms = parseInt(value);
    console.log(`NetworkControls - changing interval to ${ms}ms`);
    setRefreshRate(ms);
  };

  return (
    <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-2 shadow-sm">
      <Select
        value={updateInterval.toString()}
        onValueChange={handleIntervalChange}
        disabled={!isLiveUpdating || isLoading}
      >
        <SelectTrigger className="w-[180px] bg-background border-muted-foreground/20">
          <SelectValue placeholder="Refresh Rate" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="60000">1 minute</SelectItem>
          <SelectItem value="300000">5 minutes</SelectItem>
          <SelectItem value="600000">10 minutes</SelectItem>
          <SelectItem value="900000">15 minutes</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        variant="outline" 
        className={`flex items-center gap-1 transition-all duration-300 ${isLiveUpdating ? 'bg-primary/10 hover:bg-primary/20' : 'bg-background'}`}
        onClick={toggleLiveUpdates}
      >
        {isLiveUpdating ? (
          <>
            <PauseCircle size={16} className="text-primary" />
            <span>Pause Auto</span>
          </>
        ) : (
          <>
            <PlayCircle size={16} />
            <span>Enable Auto</span>
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
