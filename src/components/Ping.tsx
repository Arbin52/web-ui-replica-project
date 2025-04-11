
import React, { useState, useEffect } from 'react';
import { Signal, AlertCircle, Info, Network, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

interface PingResult {
  seq: number;
  time: number;
  status: 'success' | 'timeout';
}

const Ping: React.FC = () => {
  const [targetHost, setTargetHost] = useState('8.8.8.8');
  const [pingCount, setPingCount] = useState(4);
  const [pingResults, setPingResults] = useState<PingResult[]>([]);
  const [isPinging, setIsPinging] = useState(false);
  const [pingProgress, setPingProgress] = useState(0);
  
  const presetHosts = [
    { name: 'Google DNS', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS', ip: '1.1.1.1' },
    { name: 'Default Gateway', ip: '192.168.1.1' },
    { name: 'Google.com', ip: 'google.com' }
  ];

  useEffect(() => {
    // Reset progress when not pinging
    if (!isPinging) {
      setPingProgress(0);
    }
  }, [isPinging]);

  const handlePing = () => {
    if (!targetHost) return;
    
    toast.info(`Starting ping to ${targetHost}`);
    setIsPinging(true);
    setPingResults([]);
    
    // Simulate ping results
    let count = 0;
    const interval = setInterval(() => {
      count++;
      
      // Update progress percentage
      const progressPercent = (count / pingCount) * 100;
      setPingProgress(progressPercent);
      
      // Generate a random result with higher chance of success
      const newResult = { 
        seq: count, 
        time: Math.floor(Math.random() * 30 + 10), 
        status: Math.random() > 0.1 ? 'success' as const : 'timeout' as const
      };
      
      setPingResults(prev => [...prev, newResult]);
      
      if (count >= pingCount) {
        clearInterval(interval);
        setIsPinging(false);
        toast.success(`Ping to ${targetHost} completed`);
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

  const getStatusColor = (avgTime: number) => {
    if (avgTime < 20) return "text-green-600";
    if (avgTime < 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Signal size={24} />
        <h2 className="text-xl font-bold">Ping</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label htmlFor="target-host" className="block text-sm font-medium mb-1">Target Host</label>
              <div className="flex gap-2">
                <input
                  id="target-host"
                  type="text"
                  value={targetHost}
                  onChange={(e) => setTargetHost(e.target.value)}
                  disabled={isPinging}
                  placeholder="Enter hostname or IP (e.g., google.com or 8.8.8.8)"
                  className="flex-grow border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  className="border p-2 rounded"
                  value={pingCount}
                  onChange={(e) => setPingCount(Number(e.target.value))}
                  disabled={isPinging}
                >
                  <option value="4">4 packets</option>
                  <option value="8">8 packets</option>
                  <option value="16">16 packets</option>
                  <option value="32">32 packets</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button 
                onClick={handlePing} 
                disabled={isPinging || !targetHost}
                className="w-full"
                size="lg"
              >
                {isPinging ? 'Pinging...' : 'Start Ping'}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {presetHosts.map((host, index) => (
              <button
                key={index}
                onClick={() => setTargetHost(host.ip)}
                disabled={isPinging}
                className={`text-xs px-3 py-1 rounded-full border 
                  ${targetHost === host.ip ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {host.name}
              </button>
            ))}
          </div>
        </div>
        
        {isPinging && (
          <div className="my-4">
            <Progress value={pingProgress} className="h-2 mb-2" />
            <div className="text-center text-sm text-gray-500">
              Pinging {targetHost}... ({pingResults.length} of {pingCount} packets sent)
            </div>
          </div>
        )}

        {pingResults.length > 0 && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                Results
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ping measures the round-trip time for packets to travel to a host</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
                <div>PING {targetHost} ({targetHost}): 56 data bytes</div>
                {pingResults.map((result, index) => (
                  <div key={index}>
                    {result.status === 'success' 
                      ? `64 bytes from ${targetHost}: icmp_seq=${result.seq} ttl=55 time=${result.time} ms`
                      : `Request timeout for icmp_seq ${result.seq}`
                    }
                  </div>
                ))}
                {isPinging && <div className="animate-pulse">Pinging {targetHost}...</div>}
                {!isPinging && pingResults.length > 0 && (
                  <div className="mt-2">
                    <div>--- {targetHost} ping statistics ---</div>
                    <div>{pingResults.length} packets transmitted, {pingResults.filter(r => r.status === 'success').length} packets received, {calculatePacketLoss().toFixed(1)}% packet loss</div>
                    {pingResults.filter(r => r.status === 'success').length > 0 ? (
                      <div>round-trip min/avg/max = {Math.min(...pingResults.filter(r => r.status === 'success').map(r => r.time))}/{calculateAverage().toFixed(1)}/{Math.max(...pingResults.filter(r => r.status === 'success').map(r => r.time))} ms</div>
                    ) : (
                      <div>No successful ping responses</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-1 font-medium">Host</TableCell>
                      <TableCell className="py-1">{targetHost}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-1 font-medium">Average Response</TableCell>
                      <TableCell className={`py-1 font-bold ${pingResults.filter(r => r.status === 'success').length > 0 ? getStatusColor(calculateAverage()) : 'text-gray-400'}`}>
                        {pingResults.filter(r => r.status === 'success').length > 0 ? `${calculateAverage().toFixed(1)} ms` : 'N/A'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-1 font-medium">Packet Loss</TableCell>
                      <TableCell className={`py-1 ${calculatePacketLoss() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculatePacketLoss().toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-1 font-medium">Min / Max</TableCell>
                      <TableCell className="py-1">
                        {pingResults.filter(r => r.status === 'success').length > 0 ? (
                          `${Math.min(...pingResults.filter(r => r.status === 'success').map(r => r.time))} / 
                           ${Math.max(...pingResults.filter(r => r.status === 'success').map(r => r.time))} ms`
                        ) : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-1 font-medium">Status</TableCell>
                      <TableCell className="py-1">
                        {pingResults.length === 0 ? (
                          <span className="text-gray-400">Not tested</span>
                        ) : pingResults.filter(r => r.status === 'success').length === 0 ? (
                          <span className="flex items-center gap-1 text-red-500">
                            <AlertCircle size={16} /> Unreachable
                          </span>
                        ) : calculatePacketLoss() > 20 ? (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <AlertCircle size={16} /> Unstable
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-500">
                            <Signal size={16} /> Reachable
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {pingResults.length > 0 && !isPinging && (
                <div className="mt-4 flex gap-2">
                  <Button 
                    onClick={handlePing}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Network className="mr-1" size={16} />
                    Ping Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {pingResults.length === 0 && !isPinging && (
          <div className="text-center py-8">
            <Clock size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-1">No Ping Results Yet</h3>
            <p className="text-sm text-gray-500">Enter a host above and click 'Start Ping' to test connectivity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ping;
