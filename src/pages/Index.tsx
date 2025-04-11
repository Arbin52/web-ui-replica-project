
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Overview from '../components/Overview';
import Security from '../components/Security';
import Reports from '../components/Reports';
import Speed from '../components/Speed';
import Ping from '../components/Ping';
import Traceroute from '../components/Traceroute';
import WifiAnalysis from '../components/WifiAnalysis';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
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
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-grow">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-grow bg-gray-100">
          <div className="max-w-screen-xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
