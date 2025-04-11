
import React, { useState } from 'react';
import { ActivitySquare, Shield, FileBarChart, Gauge, Signal, Network, Wifi, Laptop, ChevronDown, ChevronRight, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isToolsExpanded, setIsToolsExpanded] = useState(true);

  const mainMenuItems = [
    { id: 'overview', label: 'Overview', icon: <ActivitySquare size={18} /> },
    { id: 'networks', label: 'Networks', icon: <Laptop size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart size={18} /> },
  ];
  
  const toolsMenuItems = [
    { id: 'speed', label: 'Speed Test', icon: <Gauge size={18} /> },
    { id: 'ping', label: 'Ping', icon: <Signal size={18} /> },
    { id: 'traceroute', label: 'Traceroute', icon: <Network size={18} /> },
    { id: 'wifi-analysis', label: 'Wi-Fi Channel Analysis', icon: <Wifi size={18} /> },
  ];

  const toggleToolsSubmenu = () => {
    setIsToolsExpanded(!isToolsExpanded);
  };

  return (
    <div className="bg-white border-r border-gray-200 min-h-screen w-64 p-4">
      <div className="flex flex-col gap-1">
        {mainMenuItems.map((item) => (
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

        {/* Tools Submenu */}
        <div className="mt-2">
          <button 
            className="flex items-center justify-between w-full px-4 py-3 rounded-md text-left text-gray-600 hover:bg-gray-100"
            onClick={toggleToolsSubmenu}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center text-gray-500">
                <Wrench size={18} />
              </span>
              <span>Tools</span>
            </div>
            <span>
              {isToolsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>

          {isToolsExpanded && (
            <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2">
              {toolsMenuItems.map((tool) => (
                <button 
                  key={tool.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors",
                    activeTab === tool.id 
                      ? "bg-primary text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => setActiveTab(tool.id)}
                >
                  <span className={cn(
                    "flex items-center justify-center",
                    activeTab === tool.id ? "text-white" : "text-gray-500"
                  )}>
                    {tool.icon}
                  </span>
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
