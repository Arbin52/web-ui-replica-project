
import React from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import SecurityScan from './SecurityScan';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    macFiltering: 'Enabled'
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
        <h2 className="text-xl font-bold">Security</h2>
      </div>
      
      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Security Scanner</TabsTrigger>
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="p-4 bg-white rounded-md shadow-sm border mt-2">
          <SecurityScan />
        </TabsContent>
        
        <TabsContent value="overview" className="mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Security Rating</h3>
                <div className="flex items-center gap-3">
                  <Progress value={securityData.securityRating} className="h-2" />
                  <span className="font-bold">{securityData.securityRating}%</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">Network Security</h3>

              <div className="info-row">
                <div className="info-label">Wi-Fi Security:</div>
                <div className="info-value flex items-center gap-2">
                  {securityData.wifiSecurity}
                  {getSecurityIcon('strong')}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">Firewall Status:</div>
                <div className="info-value flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {securityData.firewallStatus}
                  </span>
                  {getSecurityIcon(securityData.firewallStatus)}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">Last Security Scan:</div>
                <div className="info-value">{securityData.lastScan}</div>
              </div>

              <div className="info-row">
                <div className="info-label">Vulnerabilities Found:</div>
                <div className="info-value flex items-center gap-2">
                  {securityData.vulnerabilities}
                  {getSecurityIcon('strong')}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">Security Updates:</div>
                <div className="info-value flex items-center gap-2">
                  {securityData.securityUpdates}
                  {getSecurityIcon(securityData.securityUpdates)}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">Guest Network:</div>
                <div className="info-value flex items-center gap-2">
                  {securityData.guestNetworkEnabled ? 'Enabled' : 'Disabled'}
                  {getSecurityIcon(securityData.guestNetworkEnabled ? 'enabled' : 'disabled')}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">MAC Filtering:</div>
                <div className="info-value flex items-center gap-2">
                  {securityData.macFiltering}
                  {getSecurityIcon(securityData.macFiltering)}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Threat Protection</h3>

                <div className="info-row">
                  <div className="info-label">Blocked Events:</div>
                  <div className="info-value">{securityData.blockedEvents} in the last 7 days</div>
                </div>

                <div className="info-row">
                  <div className="info-label">Last Attack Attempt:</div>
                  <div className="info-value">{securityData.lastAttackAttempt}</div>
                </div>

                <div className="info-row">
                  <div className="info-label">Attack Type:</div>
                  <div className="info-value">{securityData.attackType}</div>
                </div>

                <div className="info-row">
                  <div className="info-label">Public Ports Exposed:</div>
                  <div className="info-value">
                    {securityData.publicPortsExposed.length === 0 
                      ? <span className="flex items-center gap-1">None {getSecurityIcon('strong')}</span> 
                      : securityData.publicPortsExposed.join(', ')
                    }
                  </div>
                </div>
              </div>

              <div className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
