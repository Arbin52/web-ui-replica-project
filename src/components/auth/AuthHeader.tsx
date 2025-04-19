
import React from 'react';
import { Wifi } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-2">
        <div className="p-3 bg-primary rounded-full">
          <Wifi size={32} className="text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Network Monitor</h1>
      <p className="text-gray-500 mt-1">Secure access to your network monitoring dashboard</p>
    </div>
  );
};

export default AuthHeader;
