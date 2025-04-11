
import React from 'react';
import { ActivitySquare, Shield, FileBarChart, Gauge, Signal, Network, Wifi, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <ActivitySquare size={18} /> },
    { id: 'networks', label: 'Networks', icon: <Laptop size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart size={18} /> },
    { id: 'speed', label: 'Speed', icon: <Gauge size={18} /> },
    { id: 'ping', label: 'Ping', icon: <Signal size={18} /> },
    { id: 'traceroute', label: 'Traceroute', icon: <Network size={18} /> },
    { id: 'wifi-analysis', label: 'Wi-Fi Channel Analysis', icon: <Wifi size={18} /> },
  ];

  return (
    <div className="bg-white border-r border-gray-200 min-h-screen w-64 p-4">
      <div className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors",
              activeTab === item.id 
                ? "bg-primary text-white font-medium"
                : "text-gray-600 hover:bg-gray-100"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={cn(
              "flex items-center justify-center",
              activeTab === item.id ? "text-white" : "text-gray-500"
            )}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
