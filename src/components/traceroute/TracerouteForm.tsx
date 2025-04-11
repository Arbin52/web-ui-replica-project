
import React from 'react';
import { Button } from "@/components/ui/button";

interface TracerouteFormProps {
  targetHost: string;
  setTargetHost: (host: string) => void;
  maxHops: number;
  setMaxHops: (hops: number) => void;
  onStartTrace: () => void;
  isTracing: boolean;
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
  isTracing
}) => {
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
  );
};
