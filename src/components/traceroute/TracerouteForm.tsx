
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TracerouteFormProps {
  targetHost: string;
  setTargetHost: (host: string) => void;
  maxHops: number;
  setMaxHops: (hops: number) => void;
  onStartTrace: () => void;
  isTracing: boolean;
  packetSize: number;
  setPacketSize: (size: number) => void;
  timeout: number;
  setTimeout: (timeout: number) => void;
}

const presetHosts = [
  { name: 'Google DNS', ip: '8.8.8.8' },
  { name: 'Cloudflare DNS', ip: '1.1.1.1' },
  { name: 'Default Gateway', ip: '192.168.1.1' },
  { name: 'Google.com', ip: 'google.com' }
];

export const TracerouteForm: React.FC<TracerouteFormProps> = ({
  targetHost,
  setTargetHost,
  maxHops,
  setMaxHops,
  onStartTrace,
  isTracing,
  packetSize,
  setPacketSize,
  timeout,
  setTimeout
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  
  return (
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
            onClick={onStartTrace} 
            disabled={isTracing || !targetHost}
            className="w-full"
            size="lg"
          >
            {isTracing ? 'Tracing...' : 'Start Trace'}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-wrap gap-2">
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs flex items-center gap-1"
        >
          <Settings size={14} />
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </Button>
      </div>
      
      {showAdvanced && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <div className="text-sm font-medium mb-2 flex items-center">
            Advanced Options
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={14} className="ml-1 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Configure detailed traceroute parameters</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="packet-size" className="block text-xs font-medium mb-1">
                Packet Size (bytes)
              </label>
              <select
                id="packet-size"
                className="w-full border p-1.5 rounded text-sm"
                value={packetSize}
                onChange={(e) => setPacketSize(Number(e.target.value))}
                disabled={isTracing}
              >
                <option value={32}>32 bytes</option>
                <option value={64}>64 bytes</option>
                <option value={128}>128 bytes</option>
                <option value={256}>256 bytes</option>
                <option value={512}>512 bytes</option>
                <option value={1024}>1024 bytes</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeout" className="block text-xs font-medium mb-1">
                Timeout (seconds)
              </label>
              <select
                id="timeout"
                className="w-full border p-1.5 rounded text-sm"
                value={timeout}
                onChange={(e) => setTimeout(Number(e.target.value))}
                disabled={isTracing}
              >
                <option value={1}>1 second</option>
                <option value={2}>2 seconds</option>
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
