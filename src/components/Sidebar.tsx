
import React from 'react';
import { ActivitySquare, Shield, FileBarChart, Gauge, Signal, Network, Wifi } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <ActivitySquare size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart size={18} /> },
    { id: 'speed', label: 'Speed', icon: <Gauge size={18} /> },
    { id: 'ping', label: 'Ping', icon: <Signal size={18} /> },
    { id: 'traceroute', label: 'Traceroute', icon: <Network size={18} /> },
    { id: 'wifi-analysis', label: 'Wi-Fi Channel Analysis', icon: <Wifi size={18} /> },
  ];

  return (
    <div className="sidebar min-h-screen">
      {menuItems.map((item) => (
        <div 
          key={item.id}
          className={`sidebar-item flex items-center gap-2 ${activeTab === item.id ? 'sidebar-active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
