
import React, { useState } from 'react';
import { Gauge, RefreshCw, Info, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Speed: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(87.5);
  const [uploadSpeed, setUploadSpeed] = useState(23.8);
  const [ping, setPing] = useState(18);
  const [jitter, setJitter] = useState(3.2);
  const [packetLoss, setPacketLoss] = useState(0);
  const [latestResult, setLatestResult] = useState({
    date: 'April 11, 2025 11:30 AM',
    server: 'Chicago, IL',
    isp: 'Comcast',
    technology: 'Fiber'
  });
  const [speedHistory, setSpeedHistory] = useState([
    { date: 'April 10, 2025', download: 85.2, upload: 22.5 },
    { date: 'April 9, 2025', download: 86.8, upload: 23.1 },
    { date: 'April 8, 2025', download: 82.3, upload: 22.0 }
  ]);
  
  const runSpeedTest = () => {
    setIsRunning(true);
    
    // Simulate a speed test
    setTimeout(() => {
      const newDownload = Math.random() * 100 + 50;
      const newUpload = Math.random() * 50 + 10;
      const newPing = Math.floor(Math.random() * 30 + 5);
      const newJitter = Math.random() * 5;
      const newPacketLoss = Math.random() < 0.8 ? 0 : Math.random() * 2;

      setDownloadSpeed(newDownload);
      setUploadSpeed(newUpload);
      setPing(newPing);
      setJitter(newJitter);
      setPacketLoss(newPacketLoss);
      
      // Update history
      const today = new Date();
      setSpeedHistory(prev => [
        { 
          date: `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`, 
          download: newDownload, 
          upload: newUpload 
        },
        ...prev.slice(0, 2)
      ]);

      setLatestResult({
        date: `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()} ${today.getHours()}:${today.getMinutes() < 10 ? '0' : ''}${today.getMinutes()} ${today.getHours() >= 12 ? 'PM' : 'AM'}`,
        server: 'Chicago, IL',
        isp: 'Comcast',
        technology: 'Fiber'
      });

      setIsRunning(false);
    }, 3000);
  };

  const getSpeedRating = (speed: number) => {
    if (speed >= 100) return "Excellent";
    if (speed >= 50) return "Very Good";
    if (speed >= 25) return "Good";
    if (speed >= 10) return "Fair";
    return "Poor";
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Gauge size={24} />
        <h2 className="text-xl font-bold">Speed Test</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md text-center hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold flex items-center gap-1 justify-center">
            <ArrowDown size={18} className="text-primary" />
            Download
          </h3>
          <p className="text-3xl font-bold">{downloadSpeed.toFixed(1)} <span className="text-lg font-normal">Mbps</span></p>
          <p className="text-sm text-gray-500">{getSpeedRating(downloadSpeed)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-center hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold flex items-center gap-1 justify-center">
            <ArrowUp size={18} className="text-primary" />
            Upload
          </h3>
          <p className="text-3xl font-bold">{uploadSpeed.toFixed(1)} <span className="text-lg font-normal">Mbps</span></p>
          <p className="text-sm text-gray-500">{getSpeedRating(uploadSpeed)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-center hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold flex items-center gap-1 justify-center">
            <Clock size={18} className="text-primary" />
            Ping
          </h3>
          <p className="text-3xl font-bold">{ping} <span className="text-lg font-normal">ms</span></p>
          <p className="text-sm text-gray-500">{ping < 20 ? 'Excellent' : ping < 50 ? 'Good' : 'Fair'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="info-row">
              <div className="info-label">Jitter:</div>
              <div className="info-value">{jitter.toFixed(1)} ms</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Packet Loss:</div>
              <div className="info-value">{packetLoss.toFixed(2)}%</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Server:</div>
              <div className="info-value">{latestResult.server} ({ping} ms)</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">ISP:</div>
              <div className="info-value">{latestResult.isp}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Connection:</div>
              <div className="info-value">{latestResult.technology}</div>
            </div>
          </div>
        </div>
        
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-2">History</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left py-1">Date</th>
                  <th className="text-center py-1">Download</th>
                  <th className="text-center py-1">Upload</th>
                </tr>
              </thead>
              <tbody>
                {speedHistory.map((entry, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-1">{entry.date}</td>
                    <td className="py-1 text-center">{entry.download.toFixed(1)} Mbps</td>
                    <td className="py-1 text-center">{entry.upload.toFixed(1)} Mbps</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="bg-primary text-white px-6 py-3 rounded flex items-center gap-2 mx-auto hover:bg-opacity-90 disabled:opacity-50 transition-colors"
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Test your connection speed to the internet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Info size={14} />
          <p>Last test: {latestResult.date}</p>
        </div>
      </div>
    </div>
  );
};

export default Speed;
