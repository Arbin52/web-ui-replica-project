
import React, { useState, useEffect } from 'react';
import { Network, Info, History } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { TracerouteForm } from './traceroute/TracerouteForm';
import { TracerouteProgress } from './traceroute/TracerouteProgress';
import { TracerouteResults, HopResult } from './traceroute/TracerouteResults';
import { TracerouteVisualization } from './traceroute/TracerouteVisualization';
import { TracerouteEmptyState } from './traceroute/TracerouteEmptyState';
import { TracerouteAnalysis } from './traceroute/TracerouteAnalysis';
import { TracerouteMap } from './traceroute/TracerouteMap';
import { TracerouteComparison } from './traceroute/TracerouteComparison';
import { TracerouteHistory, TracerouteHistoryItem } from './traceroute/TracerouteHistory';
import { 
  generateRandomIP, 
  generateGeoLocation, 
  calculateNetworkMetrics,
  classifyRoute,
  detectAnomalies,
  calculateAverageResponseTime
} from './traceroute/utils';

const Traceroute: React.FC = () => {
  const [targetHost, setTargetHost] = useState('8.8.8.8');
  const [maxHops, setMaxHops] = useState(15);
  const [traceResults, setTraceResults] = useState<HopResult[]>([]);
  const [isTracing, setIsTracing] = useState(false);
  const [traceProgress, setTraceProgress] = useState(0);
  const [packetSize, setPacketSize] = useState(64);
  const [timeout, setTimeout] = useState(3);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [networkMetrics, setNetworkMetrics] = useState<any>(null);
  const [routeClassification, setRouteClassification] = useState<string>('');
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [historyItems, setHistoryItems] = useState<TracerouteHistoryItem[]>([]);
  const [previousResults, setPreviousResults] = useState<HopResult[] | null>(null);
  const [activeTab, setActiveTab] = useState<string>('results');
  
  useEffect(() => {
    // Reset progress when not tracing
    if (!isTracing) {
      setTraceProgress(0);
    }
  }, [isTracing]);

  useEffect(() => {
    // Calculate network metrics when results change
    if (traceResults.length > 0) {
      const metrics = calculateNetworkMetrics(traceResults);
      setNetworkMetrics(metrics);
      
      const classification = classifyRoute(traceResults);
      setRouteClassification(classification);
      
      const detectedAnomalies = detectAnomalies(traceResults);
      setAnomalies(detectedAnomalies);
    }
  }, [traceResults]);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('traceroute-history');
      if (savedHistory) {
        // Parse the JSON and ensure dates are properly converted
        const parsedHistory = JSON.parse(savedHistory);
        const formattedHistory = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistoryItems(formattedHistory);
      }
    } catch (error) {
      console.error('Error loading traceroute history:', error);
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (historyItems.length > 0) {
      try {
        localStorage.setItem('traceroute-history', JSON.stringify(historyItems));
      } catch (error) {
        console.error('Error saving traceroute history:', error);
      }
    }
  }, [historyItems]);

  const handleTrace = () => {
    if (!targetHost) return;
    
    toast.info(`Starting traceroute to ${targetHost}`);
    setIsTracing(true);
    // Save current results as previous before clearing
    if (traceResults.length > 0) {
      setPreviousResults([...traceResults]);
    }
    setTraceResults([]);
    setShowAnalysis(false);
    setActiveTab('results');
    
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
        setShowAnalysis(true);
        
        // Add to history
        const newHistoryItem: TracerouteHistoryItem = {
          id: uuidv4(),
          timestamp: new Date(),
          targetHost,
          hops: totalHops,
          avgLatency: calculateAverageLatency(traceResults),
          status: 'success',
          results: [...traceResults, newHop]
        };
        
        // Limit history to most recent 20 items
        setHistoryItems(prev => [newHistoryItem, ...prev].slice(0, 20));
      }
    }, 800);
  };
  
  const calculateAverageLatency = (results: HopResult[]) => {
    let totalLatency = 0;
    let count = 0;
    
    results.forEach(hop => {
      const avg = calculateAverageResponseTime([hop.responseTime1, hop.responseTime2, hop.responseTime3]);
      if (avg !== null) {
        totalLatency += avg;
        count++;
      }
    });
    
    return count > 0 ? totalLatency / count : 0;
  };
  
  const handleSelectHistoryItem = (results: HopResult[]) => {
    setPreviousResults(traceResults.length > 0 ? [...traceResults] : null);
    setTraceResults(results);
    setActiveTab('results');
    
    // Calculate metrics for the loaded results
    const metrics = calculateNetworkMetrics(results);
    setNetworkMetrics(metrics);
    
    const classification = classifyRoute(results);
    setRouteClassification(classification);
    
    const detectedAnomalies = detectAnomalies(results);
    setAnomalies(detectedAnomalies);
    
    setShowAnalysis(true);
    toast.info(`Loaded historical trace data`);
  };
  
  const handleDeleteHistoryItem = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
    toast.success('Trace history item removed');
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
          <Tabs 
            defaultValue="results" 
            className="mt-6"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <History size={14} /> History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="pt-4">
              <div>
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

                <TracerouteComparison 
                  currentResults={traceResults}
                  previousResults={previousResults}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="pt-4">
              {showAnalysis && (
                <TracerouteAnalysis 
                  results={traceResults}
                  networkMetrics={networkMetrics}
                  routeClassification={routeClassification}
                  anomalies={anomalies}
                />
              )}
            </TabsContent>
            
            <TabsContent value="map" className="pt-4">
              <TracerouteMap results={traceResults} />
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              <TracerouteHistory 
                historyItems={historyItems}
                onSelectHistoryItem={handleSelectHistoryItem}
                onDeleteHistoryItem={handleDeleteHistoryItem}
              />
            </TabsContent>
          </Tabs>
        )}
        
        {traceResults.length === 0 && !isTracing && (
          <TracerouteEmptyState isTracing={isTracing} />
        )}
      </div>
    </div>
  );
};

export default Traceroute;
