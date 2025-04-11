
import React, { useState } from 'react';
import { Network, Globe, Info, Pause } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from "@/components/ui/badge";

const Traceroute: React.FC = () => {
  const [targetHost, setTargetHost] = useState('google.com');
  const [tracerouteResults, setTracerouteResults] = useState<{ 
    hop: number; 
    host: string; 
    ip: string; 
    time1: string; 
    time2: string; 
    time3: string;
    location?: string;
    provider?: string;
  }[]>([]);
  const [isTracing, setIsTracing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const presetHosts = [
    { name: 'Google', ip: 'google.com' },
    { name: 'Amazon', ip: 'amazon.com' },
    { name: 'Netflix', ip: 'netflix.com' },
    { name: 'Default Gateway', ip: '192.168.1.1' }
  ];

  const handleTraceroute = () => {
    if (!targetHost || isTracing) return;
    
    setIsTracing(true);
    setIsPaused(false);
    setTracerouteResults([]);
    
    // Simulate traceroute results with location and provider data
    const simulatedResults = [
      { hop: 1, host: 'gateway', ip: '192.168.1.1', time1: '1.2 ms', time2: '1.1 ms', time3: '1.3 ms', location: 'Local Network', provider: 'Home Network' },
      { hop: 2, host: 'isp-router-1.local', ip: '10.0.0.1', time1: '8.3 ms', time2: '8.5 ms', time3: '8.1 ms', location: 'Local Area', provider: 'Comcast' },
      { hop: 3, host: 'isp-core.net', ip: '72.14.215.85', time1: '15.2 ms', time2: '14.8 ms', time3: '15.0 ms', location: 'Chicago, IL', provider: 'Comcast' },
      { hop: 4, host: 'google-peer.net', ip: '142.250.68.1', time1: '19.5 ms', time2: '18.9 ms', time3: '19.2 ms', location: 'Chicago, IL', provider: 'Google' },
      { hop: 5, host: 'google-server.net', ip: '142.250.68.110', time1: '20.1 ms', time2: '20.3 ms', time3: '19.8 ms', location: 'Mountain View, CA', provider: 'Google' }
    ];
    
    let count = 0;
    let interval: NodeJS.Timeout;
    
    const processNextHop = () => {
      if (count < simulatedResults.length && !isPaused) {
        setTracerouteResults(prev => [...prev, simulatedResults[count]]);
        count++;
        
        if (count >= simulatedResults.length) {
          clearInterval(interval);
          setIsTracing(false);
        }
      }
    };
    
    interval = setInterval(processNextHop, 1000);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getAverageTime = (result: { time1: string; time2: string; time3: string }) => {
    const t1 = parseFloat(result.time1.split(' ')[0]);
    const t2 = parseFloat(result.time2.split(' ')[0]);
    const t3 = parseFloat(result.time3.split(' ')[0]);
    return ((t1 + t2 + t3) / 3).toFixed(1) + ' ms';
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Network size={24} />
        <h2 className="text-xl font-bold">Traceroute</h2>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label htmlFor="target-host" className="block text-sm font-medium mb-1">Target Host</label>
            <input
              id="target-host"
              type="text"
              value={targetHost}
              onChange={(e) => setTargetHost(e.target.value)}
              placeholder="Enter hostname or IP (e.g., google.com)"
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="md:col-span-1 flex items-end">
            <div className="flex gap-2 w-full">
              <button 
                onClick={handleTraceroute} 
                disabled={isTracing || !targetHost}
                className="flex-grow bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 transition-colors"
              >
                {isTracing ? 'Tracing...' : 'Trace'}
              </button>
              {isTracing && (
                <button
                  onClick={togglePause}
                  className="border border-gray-300 px-2 rounded hover:bg-gray-100"
                >
                  {isPaused ? <Network size={18} /> : <Pause size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {presetHosts.map((host, index) => (
            <button
              key={index}
              onClick={() => setTargetHost(host.ip)}
              className={`text-xs px-3 py-1 rounded-full border 
                ${targetHost === host.ip ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {host.name}
            </button>
          ))}
        </div>
      </div>

      {(tracerouteResults.length > 0 || isTracing) && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Results
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Traceroute shows the path packets take to reach the destination</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="flex gap-1 items-center">
                <Globe size={14} />
                {targetHost}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
              <div>traceroute to {targetHost} ({targetHost}), 30 hops max, 60 byte packets</div>
              {tracerouteResults.map((result, index) => (
                <div key={index}>
                  {result.hop}  {result.host} ({result.ip})  {result.time1}  {result.time2}  {result.time3}
                </div>
              ))}
              {isTracing && !isPaused && <div className="animate-pulse">Tracing route...</div>}
              {isTracing && isPaused && <div className="text-amber-400">Trace paused... Click resume to continue</div>}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-4 rounded-md overflow-y-auto" style={{ maxHeight: '250px' }}>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b">
                      <th className="pb-1">Hop</th>
                      <th className="pb-1">Avg Time</th>
                      <th className="pb-1 hidden sm:table-cell">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracerouteResults.map((result, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-100">
                        <td className="py-2 text-sm">
                          <div className="font-medium">{result.hop}</div>
                          <div className="text-xs text-gray-500 truncate" style={{ maxWidth: '120px' }}>{result.host}</div>
                        </td>
                        <td className="py-2 text-sm">{getAverageTime(result)}</td>
                        <td className="py-2 text-sm hidden sm:table-cell">
                          {result.location && (
                            <div className="text-xs">
                              <div>{result.location}</div>
                              <div className="text-gray-500">{result.provider}</div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                <p className="flex items-center gap-1">
                  <Info size={12} />
                  Traceroute shows each router in the path to the destination
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Traceroute;
