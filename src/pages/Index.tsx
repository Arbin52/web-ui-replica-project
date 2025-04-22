
import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Overview from '../components/overview';
import Security from '../components/Security';
import Reports from '../components/Reports';
import Speed from '../components/Speed';
import Ping from '../components/Ping';
import Traceroute from '../components/Traceroute';
import WifiAnalysis from '../components/WifiAnalysis';
import WifiManager from '../components/wifi/WifiManager';
import { ComponentErrorBoundary } from '@/components/ui/component-error-boundary';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousTab, setPreviousTab] = useState('overview');
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    if (tab === 'networks') {
      navigate('/networks');
    } else if (tab === 'wifi') {
      navigate('/wifi');
    } else {
      setPreviousTab(activeTab);
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsTransitioning(false);
      }, 300);
    }
  };

  useEffect(() => {
    // Set page title based on active tab
    document.title = `Network Monitor | ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  }, [activeTab]);

  // Safe content renderer with error boundary
  const renderContent = () => {
    return (
      <ComponentErrorBoundary 
        fallbackMessage={`There was an error loading the ${activeTab} section`}
        onReset={() => {
          console.log(`Attempting to recover ${activeTab} section`);
        }}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        }>
          {(() => {
            switch (activeTab) {
              case 'overview':
                return <Overview />;
              case 'security':
                return <Security />;
              case 'reports':
                return <Reports />;
              case 'speed':
                return <Speed />;
              case 'ping':
                return <Ping />;
              case 'traceroute':
                return <Traceroute />;
              case 'wifi-analysis':
                return <WifiAnalysis />;
              case 'wifi':
                return <WifiManager />;
              default:
                return <Overview />;
            }
          })()}
        </Suspense>
      </ComponentErrorBoundary>
    );
  };

  // Determine animation direction based on sidebar order
  const getAnimationDirection = () => {
    const tabOrder = ['overview', 'networks', 'wifi', 'security', 'reports', 'speed', 'ping', 'traceroute', 'wifi-analysis'];
    const prevIndex = tabOrder.indexOf(previousTab);
    const currentIndex = tabOrder.indexOf(activeTab);
    
    return prevIndex < currentIndex ? 'slide-right' : 'slide-left';
  };

  const animationDirection = getAnimationDirection();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex flex-grow">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        <main className="flex-grow overflow-y-auto">
          <div className="max-w-screen-xl mx-auto p-4 md:p-6">
            <div 
              className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform ' + 
                (animationDirection === 'slide-right' ? 'translate-x-10' : '-translate-x-10') : 
                'opacity-100 transform translate-x-0 animate-fade-in'}`}
            >
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
