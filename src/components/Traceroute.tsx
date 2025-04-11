
import React, { useState, useEffect } from 'react';
import { Network, Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

import { TracerouteForm } from './traceroute/TracerouteForm';
import { TracerouteProgress } from './traceroute/TracerouteProgress';
import { TracerouteResults, HopResult } from './traceroute/TracerouteResults';
import { TracerouteVisualization } from './traceroute/TracerouteVisualization';
import { TracerouteEmptyState } from './traceroute/TracerouteEmptyState';
import { generateRandomIP, generateGeoLocation } from './traceroute/utils';

const Traceroute: React.FC = () => {
  const [targetHost, setTargetHost] = useState('8.8.8.8');
  const [maxHops, setMaxHops] = useState(15);
  const [traceResults, setTraceResults] = useState<HopResult[]>([]);
  const [isTracing, setIsTracing] = useState(false);
  const [traceProgress, setTraceProgress] = useState(0);
  const [packetSize, setPacketSize] = useState(64);
  const [timeout, setTimeout] = useState(3);
  
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
      
      // Generate geolocation data
      const { country, city, latitude, longitude, isp, asn } = generateGeoLocation();
      
      // Generate a random hop result
      const newHop: HopResult = {
        hop: hopCount,
        ipAddress: generateRandomIP(),
        hostName: Math.random() > 0.3 ? `host-${hopCount}.example.com` : null,
        responseTime1: Math.random() > 0.1 ? Math.floor(Math.random() * 50 + 5) : null,
        responseTime2: Math.random() > 0.2 ? Math.floor(Math.random() * 50 + 5) : null,
        responseTime3: Math.random() > 0.15 ? Math.floor(Math.random() * 50 + 5) : null,
        status: hopCount === totalHops ? 'success' : 
                Math.random() > 0.9 ? 'timeout' : 'success',
        country,
        city,
        latitude,
        longitude,
        isp,
        asn
      };
      
      setTraceResults(prev => [...prev, newHop]);
      
      if (hopCount >= totalHops) {
        clearInterval(interval);
        setIsTracing(false);
        toast.success(`Traceroute to ${targetHost} completed with ${totalHops} hops`);
      }
    }, 800);
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Network size={24} />
        <h2 className="text-xl font-bold">Traceroute</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <TracerouteForm
          targetHost={targetHost}
          setTargetHost={setTargetHost}
          maxHops={maxHops}
          setMaxHops={setMaxHops}
          onStartTrace={handleTrace}
          isTracing={isTracing}
          packetSize={packetSize}
          setPacketSize={setPacketSize}
          timeout={timeout}
          setTimeout={setTimeout}
        />
        
        <TracerouteProgress
          isTracing={isTracing}
          progress={traceProgress}
          targetHost={targetHost}
          hopsDiscovered={traceResults.length}
        />

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
            
            <TracerouteResults results={traceResults} />
            
            <TracerouteVisualization 
              results={traceResults}
              isTracing={isTracing}
              onTraceAgain={handleTrace}
            />
          </div>
        )}
        
        <TracerouteEmptyState isTracing={isTracing} />
      </div>
    </div>
  );
};

export default Traceroute;
