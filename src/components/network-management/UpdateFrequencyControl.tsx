
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UpdateFrequencyControlProps {
  updateInterval: number;
  setRefreshRate: (interval: number) => void;
}

export const UpdateFrequencyControl: React.FC<UpdateFrequencyControlProps> = ({
  updateInterval,
  setRefreshRate
}) => {
  const handleIntervalChange = (interval: number) => {
    // Only change if it's different than the current interval
    if (interval !== updateInterval) {
      console.log(`Changing update interval from ${updateInterval}ms to ${interval}ms`);
      setRefreshRate(interval);
      toast.success(`Update interval changed to ${interval === 60000 ? '1 minute' : `${interval / 1000} seconds`}`);
    }
  };

  return (
    <div className="bg-muted/50 rounded-md p-3 flex justify-between items-center">
      <div>
        <h3 className="font-medium">Update Frequency</h3>
        <p className="text-sm text-muted-foreground">Adjust how often network data is refreshed</p>
      </div>
      <div className="flex gap-2">
        {[10000, 30000, 60000].map(interval => (
          <Button 
            key={interval} 
            size="sm"
            variant={updateInterval === interval ? "default" : "outline"}
            onClick={() => handleIntervalChange(interval)}
          >
            {interval === 60000 ? '1 min' : `${interval / 1000} sec`}
          </Button>
        ))}
      </div>
    </div>
  );
};
