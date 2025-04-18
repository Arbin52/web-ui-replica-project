import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ScanProgress from './security/ScanProgress';
import ScanResults from './security/ScanResults';
import { Vulnerability } from './security/types';

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

  return (
    <div className="space-y-6">
      {isScanning && <ScanProgress progress={progress} />}

      {scanResults && !isScanning && (
        <ScanResults 
          scanResults={scanResults}
          onResolve={resolveVulnerability}
        />
      )}

      <Button
        onClick={runSecurityScan}
        disabled={isScanning}
        className={`w-full md:w-auto ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Shield size={16} className="mr-2" />
        {isScanning ? 'Scanning...' : 'Run Security Scan'}
      </Button>
    </div>
  );
};

export default SecurityScan;
