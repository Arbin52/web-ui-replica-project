
import React from 'react';
import { Signal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NetworkStatus } from '@/hooks/network/types';

interface AvailableNetworksProps {
  networkStatus: NetworkStatus | null;
  isLoading: boolean;
}

export const AvailableNetworks: React.FC<AvailableNetworksProps> = ({ networkStatus, isLoading }) => {
  const getSignalStrength = (signalValue: number) => {
    const percentage = 100 - (Math.abs(signalValue) - 30) * 1.5;
    return Math.max(0, Math.min(100, percentage));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Signal size={18} />
          <CardTitle className="text-lg">Available Networks ({isLoading ? '...' : networkStatus?.availableNetworks?.length || 0})</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : networkStatus?.availableNetworks && networkStatus.availableNetworks.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-2">Network Name</th>
                  <th className="pb-2">Signal</th>
                  <th className="pb-2">Security</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {networkStatus.availableNetworks.map((network) => (
                  <tr key={network.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">{network.ssid}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              getSignalStrength(network.signal) > 70 ? 'bg-green-500' : 
                              getSignalStrength(network.signal) > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${getSignalStrength(network.signal)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{network.signal} dBm</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {network.security}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No available networks found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
