
export interface NetworkStatus {
  networkName: string;
  localIp: string;
  publicIp: string;
  gatewayIp: string;
  signalStrength: string;
  signalStrengthDb: string;
  networkType: string;
  macAddress: string;
  dnsServer: string;
  connectedDevices: {
    id: number;
    name: string;
    ip: string;
    mac: string;
    type: string;
    status?: 'Online' | 'Offline'; // Add optional status property
  }[];
  lastUpdated: Date;
  isOnline: boolean;
  connectionSpeed: {
    download: number;
    upload: number;
    latency: number;
  };
  dataUsage?: {
    download: number;
    upload: number;
    total: number;
  };
  connectionHistory?: {
    timestamp: Date;
    status: 'connected' | 'disconnected';
    ssid?: string;
  }[];
  availableNetworks?: {
    id: number;
    ssid: string;
    signal: number;
    security: string;
  }[];
}

