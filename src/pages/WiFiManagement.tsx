
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import WifiManager from '../components/wifi/WifiManager';

const WiFiManagement: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab="wifi" setActiveTab={() => {}} />
      <div className="flex flex-grow">
        <div className="hidden md:block">
          <Sidebar activeTab="wifi" setActiveTab={() => {}} />
        </div>
        <main className="flex-grow overflow-y-auto">
          <div className="max-w-screen-xl mx-auto p-4 md:p-6">
            <div className="animate-fade-in">
              <div className="content-card">
                <h2 className="text-xl font-bold mb-6">WiFi Management</h2>
                <WifiManager />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WiFiManagement;
