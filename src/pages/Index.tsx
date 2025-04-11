
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Overview from '../components/Overview';
import Security from '../components/Security';
import Reports from '../components/Reports';
import Speed from '../components/Speed';
import Ping from '../components/Ping';
import Traceroute from '../components/Traceroute';
import WifiAnalysis from '../components/WifiAnalysis';
import NetworkManagement from './NetworkManagement';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    if (tab === 'networks') {
      navigate('/networks');
    } else {
      setActiveTab(tab);
    }
  };

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex flex-grow">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        <div className="flex-grow">
          <div className="max-w-screen-xl mx-auto p-4 md:p-6 animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
