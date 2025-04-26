
import React from 'react';
import { Wifi, Lock, Server } from 'lucide-react';
import { getSecurityIcon } from './utils';

interface SecurityNetworkSectionProps {
  securityData: {
    dnsProtection: string;
    vpnStatus: string;
    networkSegmentation: string;
    intrusionDetection: string;
  };
}

const SecurityNetworkSection: React.FC<SecurityNetworkSectionProps> = ({ securityData }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-3">
        <Wifi className="text-blue-500" size={20} />
        <h3 className="text-lg font-semibold">Network Protection</h3>
      </div>
      
      <div className="space-y-3">
        <div className="info-row">
          <div className="info-label">DNS Protection:</div>
          <div className="info-value flex items-center gap-2">
            {securityData.dnsProtection}
            {getSecurityIcon('active')}
          </div>
        </div>

        <div className="info-row">
          <div className="info-label">VPN Status:</div>
          <div className="info-value flex items-center gap-2">
            {securityData.vpnStatus}
            {getSecurityIcon(securityData.vpnStatus === 'Connected' ? 'active' : 'inactive')}
          </div>
        </div>

        <div className="info-row">
          <div className="info-label">Network Segmentation:</div>
          <div className="info-value flex items-center gap-2">
            {securityData.networkSegmentation}
            {getSecurityIcon(securityData.networkSegmentation)}
          </div>
        </div>

        <div className="info-row">
          <div className="info-label">Intrusion Detection:</div>
          <div className="info-value flex items-center gap-2">
            {securityData.intrusionDetection}
            {getSecurityIcon(securityData.intrusionDetection)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityNetworkSection;
