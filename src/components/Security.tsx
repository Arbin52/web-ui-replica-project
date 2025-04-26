import React from 'react';
import { Shield, Wifi, Lock, CheckCircle, XCircle, AlertCircle, Server, Database } from 'lucide-react';
import SecurityScan from './SecurityScan';
import SecurityMonitoring from './security/SecurityMonitoring';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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

  const getSecurityRatingColor = (rating: number) => {
    if (rating >= 80) return "bg-green-500";
    if (rating >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSecurityIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'enabled':
      case 'strong':
      case 'up to date':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'inactive':
      case 'disabled':
      case 'weak':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-amber-500" />;
    }
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
              </div>

              <div className="space-y-6">
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

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="text-amber-500" size={20} />
                    <h3 className="text-lg font-semibold">System Protection</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold mb-2">Blocked IP Addresses</h3>
                    <div className="bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-gray-500 border-b">
                            <th className="pb-1">IP Address</th>
                            <th className="pb-1">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {securityData.blockedIps.map((ip, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-1.5 text-sm">{ip}</td>
                              <td className="py-1.5 text-sm">
                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                  Blocked
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Security;
