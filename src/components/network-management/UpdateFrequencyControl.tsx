
import React from 'react';
import { Button } from "@/components/ui/button";

interface UpdateFrequencyControlProps {
  updateInterval: number;
  setRefreshRate: (interval: number) => void;
}

export const UpdateFrequencyControl: React.FC<UpdateFrequencyControlProps> = ({
  updateInterval,
  setRefreshRate
}) => {
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
            onClick={() => setRefreshRate(interval)}
          >
            {interval === 60000 ? '1m' : `${interval / 1000}s`}
          </Button>
        ))}
      </div>
    </div>
  );
};
