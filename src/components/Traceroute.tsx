
import React, { useState } from 'react';
import { Network } from 'lucide-react';

const Traceroute: React.FC = () => {
  const [targetHost, setTargetHost] = useState('google.com');
  const [tracerouteResults, setTracerouteResults] = useState<{ hop: number; host: string; ip: string; time1: string; time2: string; time3: string }[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  const handleTraceroute = () => {
    if (!targetHost) return;
    
    setIsTracing(true);
    setTracerouteResults([]);
    
    // Simulate traceroute results
    const simulatedResults = [
      { hop: 1, host: 'gateway', ip: '192.168.1.1', time1: '1.2 ms', time2: '1.1 ms', time3: '1.3 ms' },
      { hop: 2, host: 'isp-router-1.local', ip: '10.0.0.1', time1: '8.3 ms', time2: '8.5 ms', time3: '8.1 ms' },
      { hop: 3, host: 'isp-core.net', ip: '72.14.215.85', time1: '15.2 ms', time2: '14.8 ms', time3: '15.0 ms' },
      { hop: 4, host: 'google-peer.net', ip: '142.250.68.1', time1: '19.5 ms', time2: '18.9 ms', time3: '19.2 ms' },
      { hop: 5, host: 'google-server.net', ip: '142.250.68.110', time1: '20.1 ms', time2: '20.3 ms', time3: '19.8 ms' }
    ];
    
    let count = 0;
    const interval = setInterval(() => {
      setTracerouteResults(prev => [...prev, simulatedResults[count]]);
      count++;
      
      if (count >= simulatedResults.length) {
        clearInterval(interval);
        setIsTracing(false);
      }
    }, 1000);
  };

  return (
    <div className="content-card">
      <div className="flex items-center gap-2 mb-4">
        <Network size={24} />
        <h2 className="text-xl font-bold">Traceroute</h2>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
            placeholder="Enter hostname or IP (e.g., google.com)"
            className="flex-grow border p-2 rounded"
          />
          <button 
            onClick={handleTraceroute} 
            disabled={isTracing || !targetHost}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {isTracing ? 'Tracing...' : 'Trace'}
          </button>
        </div>
      </div>

      {tracerouteResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
            <div>traceroute to {targetHost} ({targetHost}), 30 hops max, 60 byte packets</div>
            {tracerouteResults.map((result, index) => (
              <div key={index}>
                {result.hop}  {result.host} ({result.ip})  {result.time1}  {result.time2}  {result.time3}
              </div>
            ))}
            {isTracing && <div className="animate-pulse">Tracing route...</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Traceroute;
