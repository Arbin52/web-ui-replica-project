import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ConnectionStatusHeader } from './connection/ConnectionStatusHeader';
import { NetworkNameDisplay } from './connection/NetworkNameDisplay';
import { NetworkInfoDetails } from './connection/NetworkInfoDetails';
import { ConnectionSpeed } from './connection/ConnectionSpeed';
import { DisconnectAction } from './connection/DisconnectAction';
import { DisconnectedState } from './connection/DisconnectedState';
import { LoadingState } from './connection/LoadingState';
import { RealTimeIndicator } from './connection/RealTimeIndicator';
import '../../overview/index.css';

const CurrentConnection: React.FC<{
  networkStatus: any; 
  isLoading: boolean; 
  isDisconnecting: boolean; 
  handleScanNetworks: () => void; 
  handleDisconnect: () => void; 
  scanInProgress: boolean; 
  onEditNetworkName?: () => void;
}> = ({ 
  networkStatus, 
  isLoading, 
  isDisconnecting, 
  handleScanNetworks, 
  handleDisconnect, 
  scanInProgress, 
  onEditNetworkName 
}) => {
  return (
    <Card className="relative">
      {networkStatus?.isOnline && <RealTimeIndicator />}

      <CardHeader>
        <ConnectionStatusHeader isOnline={networkStatus?.isOnline || false} />
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : networkStatus?.isOnline ? (
          <div className="space-y-4">
            <NetworkNameDisplay 
              networkName={networkStatus.networkName}
              lastUpdated={networkStatus.lastUpdated}
              signalStrength={networkStatus.signalStrength}
              signalStrengthDb={networkStatus.signalStrengthDb}
              onEditNetworkName={onEditNetworkName || (() => {})}
            />
            
            <NetworkInfoDetails
              localIp={networkStatus.localIp}
              gatewayIp={networkStatus.gatewayIp}
              dnsServer={networkStatus.dnsServer}
              networkType={networkStatus.networkType}
              macAddress={networkStatus.macAddress}
            />
            
            <ConnectionSpeed 
              downloadSpeed={networkStatus.connectionSpeed.download}
              uploadSpeed={networkStatus.connectionSpeed.upload}
            />
          </div>
        ) : (
          <DisconnectedState 
            handleScanNetworks={handleScanNetworks}
            scanInProgress={scanInProgress}
          />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {networkStatus?.isOnline && (
          <DisconnectAction 
            isDisconnecting={isDisconnecting}
            onDisconnect={handleDisconnect}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default CurrentConnection;
