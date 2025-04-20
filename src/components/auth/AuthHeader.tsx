
import React from 'react';
import { Lock, WifiIcon } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-2">
        <div className="relative p-5 bg-gradient-to-b from-cyan-300 to-cyan-400 rounded-full">
          <WifiIcon 
            size={28} 
            className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%]" 
          />
          <Lock 
            size={20} 
            className="text-white absolute bottom-3.5 left-1/2 transform -translate-x-1/2" 
          />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">WiFi Security Auditing</h1>
      <p className="text-gray-500 mt-1">Secure access to your network monitoring dashboard</p>
    </div>
  );
};

export default AuthHeader;
