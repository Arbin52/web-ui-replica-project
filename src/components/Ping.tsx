
import React, { useState } from 'react';
import { Signal } from 'lucide-react';

const Ping: React.FC = () => {
  const [targetHost, setTargetHost] = useState('8.8.8.8');
  const [pingResults, setPingResults] = useState<{ seq: number; time: number; status: string }[]>([
    { seq: 1, time: 18, status: 'success' },
    { seq: 2, time: 19, status: 'success' },
    { seq: 3, time: 17, status: 'success' },
    { seq: 4, time: 20, status: 'success' }
  ]);
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = () => {
    if (!targetHost) return;
    
    setIsPinging(true);
    setPingResults([]);
    
    // Simulate ping results
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setPingResults(prev => [
        ...prev, 
        { 
          seq: count, 
          time: Math.floor(Math.random() * 30 + 10), 
          status: Math.random() > 0.1 ? 'success' : 'timeout'
        }
      ]);
      
      if (count >= 4) {
        clearInterval(interval);
        setIsPinging(false);
      }
    }, 1000);
  };

  const calculateAverage = () => {
    const successful = pingResults.filter(r => r.status === 'success');
    if (successful.length === 0) return 0;
    return successful.reduce((sum, result) => sum + result.time, 0) / successful.length;
  };

  const calculatePacketLoss = () => {
    if (pingResults.length === 0) return 0;
    const lost = pingResults.filter(r => r.status !== 'success').length;
    return (lost / pingResults.length) * 100;
  };

  return (
    <div className="content-card">
      <div className="flex items-center gap-2 mb-4">
        <Signal size={24} />
        <h2 className="text-xl font-bold">Ping</h2>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
            placeholder="Enter hostname or IP (e.g., google.com or 8.8.8.8)"
            className="flex-grow border p-2 rounded"
          />
          <button 
            onClick={handlePing} 
            disabled={isPinging || !targetHost}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {isPinging ? 'Pinging...' : 'Ping'}
          </button>
        </div>
      </div>

      {pingResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-48 overflow-y-auto">
            <div>PING {targetHost} ({targetHost}): 56 data bytes</div>
            {pingResults.map((result, index) => (
              <div key={index}>
                {result.status === 'success' 
                  ? `64 bytes from ${targetHost}: icmp_seq=${result.seq} ttl=55 time=${result.time} ms`
                  : `Request timeout for icmp_seq ${result.seq}`
                }
              </div>
            ))}
            <div className="mt-2">
              <div>--- {targetHost} ping statistics ---</div>
              <div>{pingResults.length} packets transmitted, {pingResults.filter(r => r.status === 'success').length} packets received, {calculatePacketLoss().toFixed(1)}% packet loss</div>
              <div>round-trip min/avg/max = {Math.min(...pingResults.filter(r => r.status === 'success').map(r => r.time))}/{calculateAverage().toFixed(1)}/{Math.max(...pingResults.filter(r => r.status === 'success').map(r => r.time))} ms</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ping;
