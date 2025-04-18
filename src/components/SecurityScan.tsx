import React, { useState } from 'react';
import { Shield, ScanSearch, ShieldCheck, ShieldAlert, ExternalLink, CheckCircle2, Wifi, Server, Lock, Settings } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Vulnerability {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  fixSteps: string[];
  resolved: boolean;
  category: 'network' | 'system' | 'access' | 'configuration';
  impact: string;
  detectedDate: string;
}

const SecurityScan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<{
    vulnerabilities: Vulnerability[];
    status: string;
    lastScan: string;
  } | null>(null);

  const runSecurityScan = async () => {
    setIsScanning(true);
    setProgress(0);
    toast.info('Starting security scan...');

    const stages = [
      'Checking firewall status...',
      'Scanning open ports...',
      'Analyzing network traffic...',
      'Checking for vulnerabilities...',
      'Verifying security settings...',
    ];

    for (let i = 0; i < stages.length; i++) {
      toast.info(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress((i + 1) * (100 / stages.length));
    }

    const possibleVulnerabilities = [
      {
        id: 'vuln-1',
        severity: 'high',
        category: 'network',
        title: 'Firewall Port 22 Exposed',
        description: 'SSH port is accessible from the internet, allowing potential unauthorized access.',
        impact: 'Critical - Allows direct remote access to system resources',
        detectedDate: new Date().toLocaleString(),
        fixSteps: [
          'Update firewall rules to restrict SSH access',
          'Implement IP whitelisting for SSH connections',
          'Consider changing the default SSH port',
          'Enable key-based authentication only'
        ],
        resolved: false
      },
      {
        id: 'vuln-2',
        severity: 'medium',
        category: 'system',
        title: 'Outdated Router Firmware',
        description: 'Your router firmware is out of date and missing security patches.',
        impact: 'Moderate - Known vulnerabilities may be exploitable',
        detectedDate: new Date().toLocaleString(),
        fixSteps: [
          'Access router admin panel',
          'Navigate to System Update section',
          'Download and install the latest firmware',
          'Verify system stability after update'
        ],
        resolved: false
      },
      {
        id: 'vuln-3',
        severity: 'low',
        category: 'access',
        title: 'Weak Wi-Fi Password',
        description: 'Network password does not meet minimum security requirements.',
        impact: 'Low - Potential for unauthorized network access',
        detectedDate: new Date().toLocaleString(),
        fixSteps: [
          'Access router settings',
          'Navigate to wireless security settings',
          'Create a stronger password with at least 12 characters including numbers and special characters',
          'Update all connected devices with new password'
        ],
        resolved: false
      },
      {
        id: 'vuln-4',
        severity: 'high',
        category: 'configuration',
        title: 'UPnP Enabled',
        description: 'Universal Plug and Play is enabled and may expose network services.',
        impact: 'High - Potential for unauthorized port forwarding',
        detectedDate: new Date().toLocaleString(),
        fixSteps: [
          'Access router configuration',
          'Locate UPnP settings',
          'Disable UPnP feature',
          'Review and manually configure required port forwards'
        ],
        resolved: false
      }
    ] as Vulnerability[];

    const numVulns = Math.floor(Math.random() * 4);
    const selectedVulnerabilities: Vulnerability[] = [];
    
    for (let i = 0; i < numVulns; i++) {
      if (possibleVulnerabilities.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleVulnerabilities.length);
        selectedVulnerabilities.push(possibleVulnerabilities.splice(randomIndex, 1)[0]);
      }
    }

    const mockResults = {
      vulnerabilities: selectedVulnerabilities,
      status: 'completed',
      lastScan: new Date().toLocaleString(),
    };

    setScanResults(mockResults);
    setIsScanning(false);
    
    if (mockResults.vulnerabilities.length === 0) {
      toast.success('Security scan complete: No vulnerabilities found');
    } else {
      toast.error(`Security scan complete: ${mockResults.vulnerabilities.length} vulnerabilities found`);
    }
  };

  const resolveVulnerability = (id: string) => {
    if (!scanResults) return;

    const updatedVulnerabilities = scanResults.vulnerabilities.map(vuln =>
      vuln.id === id ? { ...vuln, resolved: true } : vuln
    );
    
    setScanResults({
      ...scanResults,
      vulnerabilities: updatedVulnerabilities
    });
    
    toast.success('Issue successfully resolved!');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'network':
        return <Wifi size={18} />;
      case 'system':
        return <Server size={18} />;
      case 'access':
        return <Lock size={18} />;
      case 'configuration':
        return <Settings size={18} />;
      default:
        return <Shield size={18} />;
    }
  };

  const unresolvedVulnerabilities = scanResults?.vulnerabilities.filter(vuln => !vuln.resolved) || [];
  const resolvedVulnerabilities = scanResults?.vulnerabilities.filter(vuln => vuln.resolved) || [];

  return (
    <div className="space-y-6">
      {isScanning && (
        <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
          <div className="flex items-center gap-2">
            <ScanSearch className="animate-pulse text-blue-500" size={24} />
            <span className="font-medium">Security scan in progress...</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Progress: {Math.round(progress)}%
          </p>
        </div>
      )}

      {scanResults && !isScanning && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {scanResults.vulnerabilities.length === 0 ? (
                <ShieldCheck className="text-green-500" size={24} />
              ) : (
                <ShieldAlert className="text-amber-500" size={24} />
              )}
              <span className="font-semibold">Security Scan Results</span>
            </div>
            <span className="text-sm text-gray-500">Last scan: {scanResults.lastScan}</span>
          </div>

          {scanResults.vulnerabilities.length === 0 ? (
            <Alert className="bg-green-50 border-green-200">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <AlertTitle>All Clear!</AlertTitle>
              <AlertDescription>
                No vulnerabilities were detected in your network. Your security settings are good.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-amber-50 border-amber-200">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <AlertTitle>Security Issues Found</AlertTitle>
                <AlertDescription>
                  We detected {unresolvedVulnerabilities.length} security {unresolvedVulnerabilities.length === 1 ? 'issue' : 'issues'} that should be addressed.
                  {resolvedVulnerabilities.length > 0 && ` (${resolvedVulnerabilities.length} already resolved)`}
                </AlertDescription>
              </Alert>

              {unresolvedVulnerabilities.length > 0 && (
                <>
                  <h3 className="font-medium">Unresolved Issues</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {unresolvedVulnerabilities.map((vuln) => (
                      <AccordionItem key={vuln.id} value={vuln.id} className={`border rounded-md mb-2 ${getSeverityColor(vuln.severity)}`}>
                        <AccordionTrigger className="px-4 py-2 hover:no-underline">
                          <div className="flex items-center gap-2 text-left">
                            <ShieldAlert size={18} />
                            <span>{vuln.title}</span>
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full uppercase bg-white bg-opacity-60">
                              {vuln.severity}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0 bg-white border-t">
                          <div className="space-y-3">
                            <p className="text-gray-700">{vuln.description}</p>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Resolution Steps:</h4>
                              <ol className="list-decimal pl-5 space-y-1 text-sm">
                                {vuln.fixSteps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ol>
                            </div>
                            
                            <div className="pt-2 flex justify-between items-center">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-blue-600"
                              >
                                <ExternalLink size={14} className="mr-1" />
                                Learn More
                              </Button>
                              
                              <Button
                                onClick={() => resolveVulnerability(vuln.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 size={14} className="mr-1" />
                                Mark as Resolved
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </>
              )}

              {resolvedVulnerabilities.length > 0 && (
                <>
                  <h3 className="font-medium">Resolved Issues</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Issue</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resolvedVulnerabilities.map((vuln) => (
                        <TableRow key={vuln.id}>
                          <TableCell>{vuln.title}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs uppercase ${
                              vuln.severity === 'high' ? 'bg-red-100 text-red-700' :
                              vuln.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {vuln.severity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 size={14} />
                              Resolved
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <Button
        onClick={runSecurityScan}
        disabled={isScanning}
        className={`w-full md:w-auto ${
          isScanning ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Shield size={16} className="mr-2" />
        {isScanning ? 'Scanning...' : 'Run Security Scan'}
      </Button>
    </div>
  );
};

export default SecurityScan;
