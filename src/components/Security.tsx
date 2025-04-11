
import React from 'react';
import { Shield } from 'lucide-react';

const Security: React.FC = () => {
  const securityData = {
    wifiSecurity: 'WPA3',
    firewallStatus: 'Active',
    lastScan: '2023-04-11 10:30 AM',
    vulnerabilities: 0,
    blockedIps: ['45.227.253.109', '103.55.33.24'],
  };

  return (
    <div className="content-card">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={24} />
        <h2 className="text-xl font-bold">Security</h2>
      </div>

      <div className="info-row">
        <div className="info-label">Wi-Fi Security:</div>
        <div className="info-value">{securityData.wifiSecurity}</div>
      </div>

      <div className="info-row">
        <div className="info-label">Firewall Status:</div>
        <div className="info-value">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
            {securityData.firewallStatus}
          </span>
        </div>
      </div>

      <div className="info-row">
        <div className="info-label">Last Security Scan:</div>
        <div className="info-value">{securityData.lastScan}</div>
      </div>

      <div className="info-row">
        <div className="info-label">Vulnerabilities Found:</div>
        <div className="info-value">{securityData.vulnerabilities}</div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Blocked IP Addresses</h3>
        {securityData.blockedIps.map((ip, index) => (
          <div key={index} className="info-row">
            <div className="info-label">IP {index + 1}:</div>
            <div className="info-value">{ip}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90">
          Run Security Scan
        </button>
      </div>
    </div>
  );
};

export default Security;
