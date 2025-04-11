
import React from 'react';
import { Info, Router, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Overview: React.FC = () => {
  const networkData = {
    networkName: 'MyNetwork',
    localIp: '192.168.1.2',
    publicIp: '203.0.113.1',
    gatewayIp: '192.168.1.1',
    signalStrength: 'Good',
    signalStrengthDb: '-58 dBm',
    networkType: '802.11ac (5GHz)',
    macAddress: '00:1B:44:11:3A:B7',
    dnsServer: '8.8.8.8, 8.8.4.4',
    connectedDevices: [
      { id: 1, name: 'Desktop-PC', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wired' },
      { id: 2, name: 'iPhone-12', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' },
      { id: 3, name: 'Samsung-TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' }
    ]
  };

  const handleGatewayClick = () => {
    window.open(`http://${networkData.gatewayIp}`, '_blank');
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Info size={24} />
        <h2 className="text-xl font-bold">Network Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Basic Information</h3>
          
          <div className="info-row">
            <div className="info-label">Wi-Fi Network Name:</div> 
            <div className="info-value">{networkData.networkName}</div>
          </div>
          
          <div className="info-row">
            <div className="info-label">Local IP Address:</div>
            <div className="info-value">{networkData.localIp}</div>
          </div>
          
          <div className="info-row">
            <div className="info-label">Public IP Address:</div>
            <div className="info-value">{networkData.publicIp}</div>
          </div>
          
          <div className="info-row">
            <div className="info-label">Gateway IP Address:</div>
            <div className="info-value">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleGatewayClick} 
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      {networkData.gatewayIp}
                      <ExternalLink size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Access router admin interface</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-label">Signal Strength:</div>
            <div className="info-value">{networkData.signalStrength} ({networkData.signalStrengthDb})</div>
          </div>
          
          <div className="info-row">
            <div className="info-label">Network Type:</div>
            <div className="info-value">{networkData.networkType}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Advanced Details</h3>
          
          <div className="info-row">
            <div className="info-label">MAC Address:</div>
            <div className="info-value">{networkData.macAddress}</div>
          </div>
          
          <div className="info-row">
            <div className="info-label">DNS Servers:</div>
            <div className="info-value">{networkData.dnsServer}</div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Router size={18} />
              <h3 className="text-lg font-semibold">Connected Devices ({networkData.connectedDevices.length})</h3>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-1">Name</th>
                    <th className="pb-1">IP</th>
                    <th className="pb-1 hidden sm:table-cell">MAC</th>
                    <th className="pb-1 hidden sm:table-cell">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {networkData.connectedDevices.map((device) => (
                    <tr key={device.id} className="border-b border-gray-100 hover:bg-gray-100">
                      <td className="py-1 text-sm">{device.name}</td>
                      <td className="py-1 text-sm">{device.ip}</td>
                      <td className="py-1 text-sm hidden sm:table-cell">{device.mac}</td>
                      <td className="py-1 text-sm hidden sm:table-cell">{device.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
