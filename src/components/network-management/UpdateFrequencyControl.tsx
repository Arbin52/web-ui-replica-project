
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { debounce } from 'lodash';
import { Clock } from 'lucide-react';

interface UpdateFrequencyControlProps {
  updateInterval: number;
  setRefreshRate: (interval: number) => void;
}

export const UpdateFrequencyControl: React.FC<UpdateFrequencyControlProps> = ({
  updateInterval,
  setRefreshRate
}) => {
  // Create a highly debounced version of the toast to prevent frequent notifications
  const debouncedToast = useRef(
    debounce((message: string) => {
      toast.success(message);
    }, 5000) // 5 seconds between toasts
  ).current;

  const handleIntervalChange = (interval: number) => {
    // Only change if it's different than the current interval
    if (interval !== updateInterval) {
      console.log(`Changing update interval from ${updateInterval}ms to ${interval}ms`);
      setRefreshRate(interval);
      
      const intervalText = interval === 60000 ? '1 minute' :
                           interval === 300000 ? '5 minutes' : 
                           interval === 600000 ? '10 minutes' :
                           interval === 900000 ? '15 minutes' : `${interval / 60000} minutes`;
      
      debouncedToast(`Update interval changed to ${intervalText}`);
    }
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 flex justify-between items-center shadow-sm border border-muted">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Clock size={18} />
        </div>
        <div>
          <h3 className="font-medium">Update Frequency</h3>
          <p className="text-sm text-muted-foreground">Adjust how often network data is refreshed</p>
        </div>
      </div>
      <div className="flex gap-2">
        {[60000, 300000, 600000, 900000].map(interval => (
          <Button 
            key={interval} 
            size="sm"
            variant={updateInterval === interval ? "default" : "outline"}
            onClick={() => handleIntervalChange(interval)}
            className={updateInterval === interval ? "shadow-sm" : ""}
          >
            {interval === 60000 ? '1 min' : 
             interval === 300000 ? '5 min' : 
             interval === 600000 ? '10 min' :
             interval === 900000 ? '15 min' : `${interval / 60000} min`}
          </Button>
        ))}
      </div>
    </div>
  );
};
