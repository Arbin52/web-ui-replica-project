
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
  }[];
  lastUpdated: Date;
  isOnline: boolean;
  connectionSpeed: {
    download: number;
    upload: number;
    latency: number;
  };
  dataUsage?: {
    download: number; // in MB
    upload: number; // in MB
    total: number; // in MB
  };
  connectionHistory?: {
    timestamp: Date;
    status: 'connected' | 'disconnected';
    ssid?: string; // Make ssid optional
  }[];
  availableNetworks?: {
    id: number;
    ssid: string;
    signal: number;
    security: string;
  }[];
}
