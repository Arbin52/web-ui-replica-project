
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { debounce } from 'lodash';

interface UpdateFrequencyControlProps {
  updateInterval: number;
  setRefreshRate: (interval: number) => void;
}

export const UpdateFrequencyControl: React.FC<UpdateFrequencyControlProps> = ({
  updateInterval,
  setRefreshRate
}) => {
  // Create a debounced version of the toast to prevent rapid notifications
  const debouncedToast = useRef(
    debounce((message: string) => {
      toast.success(message);
    }, 2000) // 2 seconds between toasts
  ).current;

  const handleIntervalChange = (interval: number) => {
    // Only change if it's different than the current interval
    if (interval !== updateInterval) {
      console.log(`Changing update interval from ${updateInterval}ms to ${interval}ms`);
      setRefreshRate(interval);
      
      const intervalText = interval === 300000 ? '5 minutes' : 
                          interval === 180000 ? '3 minutes' :
                          interval === 120000 ? '2 minutes' :
                          interval === 60000 ? '1 minute' : `${interval / 1000} seconds`;
      
      debouncedToast(`Update interval changed to ${intervalText}`);
    }
  };

  return (
    <div className="bg-muted/50 rounded-md p-3 flex justify-between items-center">
      <div>
        <h3 className="font-medium">Update Frequency</h3>
        <p className="text-sm text-muted-foreground">Adjust how often network data is refreshed</p>
      </div>
      <div className="flex gap-2">
        {[300000, 180000, 120000, 60000].map(interval => (
          <Button 
            key={interval} 
            size="sm"
            variant={updateInterval === interval ? "default" : "outline"}
            onClick={() => handleIntervalChange(interval)}
          >
            {interval === 300000 ? '5 min' : 
             interval === 180000 ? '3 min' :
             interval === 120000 ? '2 min' : 
             interval === 60000 ? '1 min' : `${interval / 1000} sec`}
          </Button>
        ))}
      </div>
    </div>
  );
};
