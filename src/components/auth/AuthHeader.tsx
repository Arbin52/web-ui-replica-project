
import React from 'react';
import { Lock, WifiIcon } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-2">
        <div className="relative p-4 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full">
          <WifiIcon size={24} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <Lock size={16} className="text-white absolute bottom-2.5 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">WiFi Security Auditing</h1>
      <p className="text-gray-500 mt-1">Secure access to your network monitoring dashboard</p>
    </div>
  );
};

export default AuthHeader;
