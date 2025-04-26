
import React from 'react';
import { Database } from 'lucide-react';

interface BlockedIPsProps {
  blockedIps: string[];
}

const BlockedIPs: React.FC<BlockedIPsProps> = ({ blockedIps }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-3">
        <Database className="text-amber-500" size={20} />
        <h3 className="text-lg font-semibold">System Protection</h3>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-2">Blocked IP Addresses</h3>
        <div className="bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-1">IP Address</th>
                <th className="pb-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {blockedIps.map((ip, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-1.5 text-sm">{ip}</td>
                  <td className="py-1.5 text-sm">
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                      Blocked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlockedIPs;
