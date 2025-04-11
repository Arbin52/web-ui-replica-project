
import React, { useState, useEffect } from 'react';
import { Network, Route, Signal, AlertCircle, Info, Clock, RotateCw } from 'lucide-react';
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

interface HopResult {
  hop: number;
  ipAddress: string;
  hostName: string | null;
  responseTime1: number | null;
  responseTime2: number | null;
  responseTime3: number | null;
  status: 'success' | 'timeout' | 'error';
}

const Traceroute: React.FC = () => {
  const [targetHost, setTargetHost] = useState('8.8.8.8');
  const [maxHops, setMaxHops] = useState(15);
  const [traceResults, setTraceResults] = useState<HopResult[]>([]);
  const [isTracing, setIsTracing] = useState(false);
  const [traceProgress, setTraceProgress] = useState(0);
  
  const presetHosts = [
    { name: 'Google DNS', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS', ip: '1.1.1.1' },
    { name: 'Default Gateway', ip: '192.168.1.1' },
    { name: 'Google.com', ip: 'google.com' }
  ];

  useEffect(() => {
    // Reset progress when not tracing
    if (!isTracing) {
      setTraceProgress(0);
    }
  }, [isTracing]);

  const handleTrace = () => {
    if (!targetHost) return;
    
    toast.info(`Starting traceroute to ${targetHost}`);
    setIsTracing(true);
    setTraceResults([]);
    
    // Simulate traceroute results
    const totalHops = Math.floor(Math.random() * 8) + 5; // Random number between 5-12 hops
    let hopCount = 0;
    
    const interval = setInterval(() => {
      hopCount++;
      
      // Update progress percentage
      const progressPercent = (hopCount / totalHops) * 100;
      setTraceProgress(progressPercent);
      
      // Generate a random hop result
      const newHop: HopResult = {
        hop: hopCount,
        ipAddress: generateRandomIP(),
        hostName: Math.random() > 0.3 ? `host-${hopCount}.example.com` : null,
        responseTime1: Math.random() > 0.1 ? Math.floor(Math.random() * 50 + 5) : null,
        responseTime2: Math.random() > 0.2 ? Math.floor(Math.random() * 50 + 5) : null,
        responseTime3: Math.random() > 0.15 ? Math.floor(Math.random() * 50 + 5) : null,
        status: hopCount === totalHops ? 'success' : 
                Math.random() > 0.9 ? 'timeout' : 'success'
      };
      
      setTraceResults(prev => [...prev, newHop]);
      
      if (hopCount >= totalHops) {
        clearInterval(interval);
        setIsTracing(false);
        toast.success(`Traceroute to ${targetHost} completed with ${totalHops} hops`);
      }
    }, 800);
  };

  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  const calculateAverageTime = (hop: HopResult) => {
    const times = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null) as number[];
    if (times.length === 0) return null;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };

  const getHopStatusColor = (hop: HopResult) => {
    if (hop.status === 'error' || hop.status === 'timeout') return "text-red-600";
    
    const avgTime = calculateAverageTime(hop);
    if (!avgTime) return "text-gray-400";
    if (avgTime < 20) return "text-green-600";
    if (avgTime < 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Network size={24} />
        <h2 className="text-xl font-bold">Traceroute</h2>
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
                  disabled={isTracing}
                  placeholder="Enter hostname or IP (e.g., google.com or 8.8.8.8)"
                  className="flex-grow border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  className="border p-2 rounded"
                  value={maxHops}
                  onChange={(e) => setMaxHops(Number(e.target.value))}
                  disabled={isTracing}
                >
                  <option value="10">Max 10 hops</option>
                  <option value="15">Max 15 hops</option>
                  <option value="20">Max 20 hops</option>
                  <option value="30">Max 30 hops</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button 
                onClick={handleTrace} 
                disabled={isTracing || !targetHost}
                className="w-full"
                size="lg"
              >
                {isTracing ? 'Tracing...' : 'Start Trace'}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {presetHosts.map((host, index) => (
              <button
                key={index}
                onClick={() => setTargetHost(host.ip)}
                disabled={isTracing}
                className={`text-xs px-3 py-1 rounded-full border 
                  ${targetHost === host.ip ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {host.name}
              </button>
            ))}
          </div>
        </div>
        
        {isTracing && (
          <div className="my-4">
            <Progress value={traceProgress} className="h-2 mb-2" />
            <div className="text-center text-sm text-gray-500">
              Tracing route to {targetHost}... ({traceResults.length} hops discovered)
            </div>
          </div>
        )}

        {traceResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              Route Map
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Traceroute shows the path that packets take to reach the destination</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Hop</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="hidden md:table-cell">Hostname</TableHead>
                    <TableHead>Response Time (ms)</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traceResults.map((hop, index) => (
                    <TableRow key={index} className={hop.status === 'timeout' ? 'bg-gray-50' : ''}>
                      <TableCell className="font-mono">{hop.hop}</TableCell>
                      <TableCell className="font-mono">{hop.ipAddress}</TableCell>
                      <TableCell className="hidden md:table-cell">{hop.hostName || <span className="text-gray-400">Not resolved</span>}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 font-mono">
                          <span className={hop.responseTime1 ? '' : 'text-gray-400'}>
                            {hop.responseTime1 || '*'}
                          </span>
                          <span className="mx-1 text-gray-400">|</span>
                          <span className={hop.responseTime2 ? '' : 'text-gray-400'}>
                            {hop.responseTime2 || '*'}
                          </span>
                          <span className="mx-1 text-gray-400">|</span>
                          <span className={hop.responseTime3 ? '' : 'text-gray-400'}>
                            {hop.responseTime3 || '*'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {hop.status === 'timeout' ? (
                          <span className="flex items-center text-yellow-500">
                            <AlertCircle size={16} className="mr-1" /> Timeout
                          </span>
                        ) : hop.status === 'error' ? (
                          <span className="flex items-center text-red-500">
                            <AlertCircle size={16} className="mr-1" /> Error
                          </span>
                        ) : (
                          <span className={`flex items-center ${getHopStatusColor(hop)}`}>
                            <Signal size={16} className="mr-1" /> OK
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Visual route map */}
            <div className="mt-4 border rounded-md p-4 bg-gray-50">
              <h4 className="text-sm font-medium mb-3">Route Visualization</h4>
              <div className="flex items-center">
                <div className="mr-2 text-gray-500">Source</div>
                <div className="flex-grow flex items-center">
                  {traceResults.map((hop, index) => (
                    <React.Fragment key={index}>
                      <div className={`h-3 w-3 rounded-full ${getHopStatusColor(hop)}`}></div>
                      {index < traceResults.length - 1 && (
                        <div className="h-0.5 flex-grow bg-gray-300"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="ml-2 text-gray-500">Target</div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                {traceResults.length} hops, 
                {traceResults[traceResults.length - 1]?.status === 'success' 
                  ? ' destination reached' 
                  : ' destination not reached'}
              </div>
            </div>
            
            {!isTracing && (
              <div className="mt-4 flex">
                <Button 
                  onClick={handleTrace}
                  variant="outline"
                  className="ml-auto"
                  size="sm"
                >
                  <RotateCw className="mr-1" size={16} />
                  Trace Again
                </Button>
              </div>
            )}
          </div>
        )}
        
        {traceResults.length === 0 && !isTracing && (
          <div className="text-center py-8">
            <Route size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-1">No Traceroute Results Yet</h3>
            <p className="text-sm text-gray-500">Enter a host above and click 'Start Trace' to map the network path</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Traceroute;
