
import React, { memo, useRef, useState, useEffect } from 'react';
import { NetworkStatus } from '@/hooks/network/types';
import { createViewportObserver } from '@/utils/performance';

// Import our optimized card components
import SpeedTestCard from './cards/SpeedTestCard';
import PingStatusCard from './cards/PingStatusCard';
import TracerouteCard from './cards/TracerouteCard';
import WifiManagementCard from './cards/WifiManagementCard';
import ReportsCard from './cards/ReportsCard';
import NetworkManagementCard from './cards/NetworkManagementCard';

interface FeatureCardsProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ networkStatus, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<{ [key: string]: boolean }>({});
  
  // Intersection observer setup
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cards = containerRef.current.querySelectorAll('.feature-card');
    
    // Create intersection observer
    const observer = createViewportObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('data-id');
        if (id) {
          setVisibleCards((prev) => ({
            ...prev,
            [id]: entry.isIntersecting,
          }));
        }
      });
    });
    
    // Observe all cards
    cards.forEach((card) => {
      observer.observe(card);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Skip rendering if loading or no data to prevent UI jumping
  if (isLoading && !networkStatus) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded animate-pulse opacity-50"></div>
        ))}
      </div>
    );
  }

  // Calculate values to pass to cards
  const downloadSpeed = networkStatus?.connectionSpeed?.download || 0;
  const uploadSpeed = networkStatus?.connectionSpeed?.upload || 0;
  const latency = networkStatus?.connectionSpeed?.latency || 0;
  const networkName = networkStatus?.networkName || 'Unknown Network';
  const signalStrength = networkStatus?.signalStrength || 'Unknown';
  const connectedDevices = networkStatus?.connectedDevices?.length || 0;
  const isOnline = networkStatus?.isOnline ?? navigator.onLine;

  // Use staggered rendering to prevent freezing
  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
    >
      {/* Speed Test Card */}
      <div className="feature-card" data-id="speed">
        <SpeedTestCard 
          downloadSpeed={downloadSpeed}
          uploadSpeed={uploadSpeed}
        />
      </div>
      
      {/* Ping Status Card */}
      <div className="feature-card" data-id="ping">
        <PingStatusCard latency={latency} />
      </div>
      
      {/* Traceroute Card */}
      <div className="feature-card" data-id="traceroute">
        <TracerouteCard />
      </div>
      
      {/* WiFi Management Card */}
      <div className="feature-card" data-id="wifi">
        <WifiManagementCard
          networkName={networkName}
          signalStrength={signalStrength}
        />
      </div>
      
      {/* Reports Card */}
      <div className="feature-card" data-id="reports">
        <ReportsCard />
      </div>
      
      {/* Network Management Card */}
      <div className="feature-card" data-id="networks">
        <NetworkManagementCard
          deviceCount={connectedDevices}
          isOnline={isOnline}
        />
      </div>
    </div>
  );
};

export default memo(FeatureCards);
