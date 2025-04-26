
import React from 'react';
import { Server } from 'lucide-react';

interface SecurityThreatProtectionProps {
  securityData: {
    malwareBlocked: number;
    phishingAttempts: number;
    lastBackup: string;
  };
}

const SecurityThreatProtection: React.FC<SecurityThreatProtectionProps> = ({ securityData }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-3">
        <Server className="text-purple-500" size={20} />
        <h3 className="text-lg font-semibold">Threat Protection</h3>
      </div>
      
      <div className="space-y-3">
        <div className="info-row">
          <div className="info-label">Malware Blocked:</div>
          <div className="info-value">{securityData.malwareBlocked} threats</div>
        </div>

        <div className="info-row">
          <div className="info-label">Phishing Attempts:</div>
          <div className="info-value">{securityData.phishingAttempts} blocked</div>
        </div>

        <div className="info-row">
          <div className="info-label">Last Backup:</div>
          <div className="info-value">{securityData.lastBackup}</div>
        </div>
      </div>
    </div>
  );
};

export default SecurityThreatProtection;
