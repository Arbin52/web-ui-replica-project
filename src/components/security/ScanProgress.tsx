
import React from 'react';
import { ScanSearch } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ScanProgressProps {
  progress: number;
}

const ScanProgress: React.FC<ScanProgressProps> = ({ progress }) => {
  return (
    <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
      <div className="flex items-center gap-2">
        <ScanSearch className="animate-pulse text-blue-500" size={24} />
        <span className="font-medium">Security scan in progress...</span>
      </div>
      <Progress value={progress} className="h-3" />
      <p className="text-sm text-muted-foreground">
        Progress: {Math.round(progress)}%
      </p>
    </div>
  );
};

export default ScanProgress;
