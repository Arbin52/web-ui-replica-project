
import React from 'react';
import { Settings, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="network-header">
      <h1 className="text-2xl font-bold">Network Monitor</h1>
      <div className="flex gap-4">
        <button className="flex items-center gap-1">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-1">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
