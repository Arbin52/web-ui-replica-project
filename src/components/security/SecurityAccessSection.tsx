
import React from 'react';
import { Lock } from 'lucide-react';
import { getSecurityIcon } from './utils';

interface SecurityAccessSectionProps {
  securityData: {
    encryptionType: string;
    twoFactorAuth: string;
    certificateStatus: string;
  };
}

const SecurityAccessSection: React.FC<SecurityAccessSectionProps> = ({ securityData }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-3">
        <Lock className="text-green-500" size={20} />
        <h3 className="text-lg font-semibold">Access Security</h3>
      </div>
      
      <div className="space-y-3">
        <div className="info-row">
          <div className="info-label">Encryption:</div>
          <div className="info-value">{securityData.encryptionType}</div>
        </div>

        <div className="info-row">
          <div className="info-label">Two-Factor Auth:</div>
          <div className="info-value flex items-center gap-2">
            {securityData.twoFactorAuth}
            {getSecurityIcon(securityData.twoFactorAuth)}
          </div>
        </div>

        <div className="info-row">
          <div className="info-label">Certificate Status:</div>
          <div className="info-value flex items-center gap-2">
            {securityData.certificateStatus}
            {getSecurityIcon('active')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAccessSection;
