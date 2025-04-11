
import React, { useState } from 'react';
import { Gauge, RefreshCw } from 'lucide-react';

const Speed: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(87.5);
  const [uploadSpeed, setUploadSpeed] = useState(23.8);
  const [ping, setPing] = useState(18);
  
  const runSpeedTest = () => {
    setIsRunning(true);
    
    // Simulate a speed test
    setTimeout(() => {
      setDownloadSpeed(Math.random() * 100 + 50);
      setUploadSpeed(Math.random() * 50 + 10);
      setPing(Math.floor(Math.random() * 30 + 5));
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="content-card">
      <div className="flex items-center gap-2 mb-4">
        <Gauge size={24} />
        <h2 className="text-xl font-bold">Speed Test</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-md text-center">
          <h3 className="text-lg font-semibold">Download</h3>
          <p className="text-3xl font-bold">{downloadSpeed.toFixed(1)} <span className="text-lg font-normal">Mbps</span></p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md text-center">
          <h3 className="text-lg font-semibold">Upload</h3>
          <p className="text-3xl font-bold">{uploadSpeed.toFixed(1)} <span className="text-lg font-normal">Mbps</span></p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md text-center">
          <h3 className="text-lg font-semibold">Ping</h3>
          <p className="text-3xl font-bold">{ping} <span className="text-lg font-normal">ms</span></p>
        </div>
      </div>

      <div className="text-center">
        <button 
          className="bg-primary text-white px-6 py-3 rounded flex items-center gap-2 mx-auto hover:bg-opacity-90 disabled:opacity-50"
          onClick={runSpeedTest}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Running Speed Test...</span>
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              <span>Run Speed Test</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Last test: April 11, 2025 11:30 AM</p>
        <p>Server: Chicago, IL (64 ms)</p>
      </div>
    </div>
  );
};

export default Speed;
