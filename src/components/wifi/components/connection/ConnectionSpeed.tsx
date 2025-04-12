
import React from 'react';

interface ConnectionSpeedProps {
  downloadSpeed: number;
  uploadSpeed: number;
}

export const ConnectionSpeed: React.FC<ConnectionSpeedProps> = ({ downloadSpeed, uploadSpeed }) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Connection Speed</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-3xl font-bold">{downloadSpeed}<span className="text-sm ml-1">Mbps</span></p>
          <p className="text-xs text-gray-500">Download</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{uploadSpeed}<span className="text-sm ml-1">Mbps</span></p>
          <p className="text-xs text-gray-500">Upload</p>
        </div>
      </div>
    </div>
  );
};
