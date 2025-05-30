import React, { useState, useCallback } from 'react';
import { Wifi, Activity, Info } from 'lucide-react';
import { toast } from "sonner";
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@/components/ui/tooltip"

const WifiAnalysis: React.FC = () => {
  const [is5GHz, setIs5GHz] = useState(false);
  const [networks, setNetworks] = useState([
    { ssid: 'MyNetwork', channel: 6, signal: -45, security: 'WPA2' },
    { ssid: 'Neighbor_5G', channel: 1, signal: -65, security: 'WPA2' },
    { ssid: 'NETGEAR-2.4', channel: 11, signal: -70, security: 'WPA3' },
    { ssid: 'Xfinity', channel: 6, signal: -72, security: 'WPA2' },
    { ssid: 'ATT-WIFI-5G', channel: 3, signal: -75, security: 'WPA2' }
  ]);

  const channels = is5GHz 
    ? [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128]
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const channelFrequencies: { [key: number]: number } = {
    1: 2412,
    2: 2417,
    3: 2422,
    4: 2427,
    5: 2432,
    6: 2437,
    7: 2442,
    8: 2447,
    9: 2452,
    10: 2457,
    11: 2462
  };

  const getRecommendedChannels = () => {
    const channelActivity = channels.map(channel => ({
      channel,
      activity: getChannelActivity(channel)
    }));
    
    return channelActivity
      .filter(ca => ca.activity < 30)
      .map(ca => ca.channel)
      .slice(0, 3);
  };

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
    const updatedNetworks = networks.map(network => ({
      ...network,
      signal: Math.floor(Math.random() * ((-30) - (-90)) + (-90))
    }));
    setNetworks(updatedNetworks);
    toast.success(`WiFi analysis refreshed for ${is5GHz ? '5 GHz' : '2.4 GHz'} channels`);
  }, [networks, is5GHz]);

  const toggleFrequencyBand = () => {
    setIs5GHz(!is5GHz);
    toast.info(`Switched to ${!is5GHz ? '5 GHz' : '2.4 GHz'} channels`);
  };

  const getChannelQuality = (activity: number) => {
    if (activity < 30) return 'Good';
    if (activity < 60) return 'Fair';
    return 'Congested';
  };

  return (
    <div className="content-card">
      <div className="flex items-center gap-2 mb-4">
        <Wifi size={24} />
        <h2 className="text-xl font-bold">Wi-Fi Channel Analysis</h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Channel Activity ({is5GHz ? '5 GHz' : '2.4 GHz'})
          </h3>
          {!is5GHz && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <Info size={16} />
                    Channel Info
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">2.4 GHz channels operate between 2412-2462 MHz</p>
                  <p className="text-sm mt-1">Recommended: Use channels 1, 6, or 11 to minimize interference</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="w-full bg-gray-100 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            {channels.map(channel => (
              <TooltipProvider key={channel}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs cursor-help">
                      {channel}
                    </div>
                  </TooltipTrigger>
                  {!is5GHz && (
                    <TooltipContent>
                      <p>Channel {channel}</p>
                      <p className="text-xs text-gray-500">Frequency: {channelFrequencies[channel]} MHz</p>
                      <p className="text-xs">
                        Quality: {getChannelQuality(getChannelActivity(channel))}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
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

        {!is5GHz && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-700">Recommended Channels</p>
            <p className="text-sm text-blue-600">
              Based on current activity: {getRecommendedChannels().join(', ')}
            </p>
          </div>
        )}
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
