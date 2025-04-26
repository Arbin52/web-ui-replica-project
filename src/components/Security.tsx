import React from 'react';
import { Shield } from 'lucide-react';
import SecurityScan from './SecurityScan';
import SecurityMonitoring from './security/SecurityMonitoring';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityNetworkSection from './security/SecurityNetworkSection';
import SecurityAccessSection from './security/SecurityAccessSection';
import SecurityThreatProtection from './security/SecurityThreatProtection';
import BlockedIPs from './security/BlockedIPs';

const Security: React.FC = () => {
  const securityData = {
    wifiSecurity: 'WPA3',
    securityRating: 92,
    firewallStatus: 'Active',
    lastScan: '2025-04-11 10:30 AM',
    vulnerabilities: 0,
    blockedIps: ['45.227.253.109', '103.55.33.24'],
    blockedEvents: 56,
    lastAttackAttempt: '2025-04-10 23:15 PM',
    attackType: 'Port Scanning',
    publicPortsExposed: [],
    securityUpdates: 'Up to date',
    passwordStrength: 'Strong',
    guestNetworkEnabled: true,
    macFiltering: 'Enabled',
    encryptionType: 'AES-256',
    dnsProtection: 'Active',
    vpnStatus: 'Not Connected',
    malwareBlocked: 23,
    phishingAttempts: 12,
    lastBackup: '2025-04-17 08:45 AM',
    certificateStatus: 'Valid',
    twoFactorAuth: 'Enabled',
    networkSegmentation: 'Enabled',
    intrusionDetection: 'Active'
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={24} />
        <h2 className="text-xl font-bold">Security Center</h2>
      </div>
      
      <div className="grid gap-6">
        <SecurityMonitoring />
        
        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Security Scanner</TabsTrigger>
            <TabsTrigger value="network">Network Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="p-4 bg-white rounded-md shadow-sm border mt-2">
            <SecurityScan />
          </TabsContent>
          
          <TabsContent value="network" className="mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SecurityNetworkSection securityData={securityData} />
                <SecurityAccessSection securityData={securityData} />
              </div>
              <div className="space-y-6">
                <SecurityThreatProtection securityData={securityData} />
                <BlockedIPs blockedIps={securityData.blockedIps} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Security;
