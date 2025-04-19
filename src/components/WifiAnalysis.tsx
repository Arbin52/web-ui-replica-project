
import React, { useState, useCallback } from 'react';
import { Wifi, Activity } from 'lucide-react';
import { toast } from "sonner";

const WifiAnalysis: React.FC = () => {
  const [is5GHz, setIs5GHz] = useState(false);
  const [networks, setNetworks] = useState([
    { ssid: 'MyNetwork', channel: 6, signal: -45, security: 'WPA2' },
    { ssid: 'Neighbor_5G', channel: 1, signal: -65, security: 'WPA2' },
    { ssid: 'NETGEAR-2.4', channel: 11, signal: -70, security: 'WPA3' },
    { ssid: 'Xfinity', channel: 6, signal: -72, security: 'WPA2' },
    { ssid: 'ATT-WIFI-5G', channel: 3, signal: -75, security: 'WPA2' }
  ]);

  // Define channels based on frequency band
  const channels = is5GHz 
    ? [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128]
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // Convert signal strength (dBm) to a visual bar
  const getSignalStrength = (signal: number) => {
    const percentage = 100 - (Math.abs(signal) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  const getChannelActivity = (channel: number) => {
    const networksOnChannel = networks.filter(n => n.channel === channel);
    if (networksOnChannel.length === 0) return 0;
    
    return Math.min(100, networksOnChannel.length * 25 + 
      networksOnChannel.reduce((acc, n) => acc + (100 - Math.abs(n.signal)), 0) / 5);
  };

  const handleRefreshAnalysis = useCallback(() => {
    // Simulate refresh with new random values
    const updatedNetworks = networks.map(network => ({
      ...network,
      signal: Math.floor(Math.random() * ((-30) - (-90)) + (-90)) // Random signal between -30 and -90
    }));
    setNetworks(updatedNetworks);
    toast.success(`WiFi analysis refreshed for ${is5GHz ? '5 GHz' : '2.4 GHz'} channels`);
  }, [networks, is5GHz]);

  const toggleFrequencyBand = () => {
    setIs5GHz(!is5GHz);
    toast.info(`Switched to ${!is5GHz ? '5 GHz' : '2.4 GHz'} channels`);
  };

  return (
    <div className="content-card">
      <div className="flex items-center gap-2 mb-4">
        <Wifi size={24} />
        <h2 className="text-xl font-bold">Wi-Fi Channel Analysis</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Channel Activity ({is5GHz ? '5 GHz' : '2.4 GHz'})
        </h3>
        <div className="w-full bg-gray-100 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            {channels.map(channel => (
              <div key={channel} className="text-xs">{channel}</div>
            ))}
          </div>
          <div className="flex h-32">
            {channels.map(channel => {
              const activity = getChannelActivity(channel);
              return (
                <div key={channel} className="flex-1 mx-0.5">
                  <div 
                    className={`w-full bg-gradient-to-t ${
                      activity < 30 ? 'from-green-500' : 
                      activity < 60 ? 'from-yellow-500' : 
                      'from-red-500'
                    } to-transparent`} 
                    style={{ height: `${activity}%` }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low Congestion</span>
          <span>High Congestion</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Detected Networks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">SSID</th>
                <th className="text-left py-2 px-2">Channel</th>
                <th className="text-left py-2 px-2">Signal</th>
                <th className="text-left py-2 px-2">Security</th>
              </tr>
            </thead>
            <tbody>
              {networks.map((network, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{network.ssid}</td>
                  <td className="py-2 px-2">{network.channel}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            getSignalStrength(network.signal) > 70 ? 'bg-green-500' : 
                            getSignalStrength(network.signal) > 40 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${getSignalStrength(network.signal)}%` }}
                        ></div>
                      </div>
                      <span>{network.signal} dBm</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">{network.security}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleRefreshAnalysis}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-90"
        >
          <Activity size={18} />
          <span>Refresh Analysis</span>
        </button>
        <button 
          onClick={toggleFrequencyBand}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          View {is5GHz ? '2.4 GHz' : '5 GHz'} Channels
        </button>
      </div>
    </div>
  );
};

export default WifiAnalysis;
