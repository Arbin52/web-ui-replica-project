
import React, { useState } from 'react';
import { Shield, ScanSearch, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';

const SecurityScan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<{
    vulnerabilities: number;
    status: string;
    lastScan: string;
  } | null>(null);

  const runSecurityScan = async () => {
    setIsScanning(true);
    setProgress(0);
    toast.info('Starting security scan...');

    // Simulate different scan stages
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

    // Simulate scan completion
    const mockResults = {
      vulnerabilities: Math.floor(Math.random() * 3), // 0-2 vulnerabilities
      status: 'completed',
      lastScan: new Date().toLocaleString(),
    };

    setScanResults(mockResults);
    setIsScanning(false);
    
    if (mockResults.vulnerabilities === 0) {
      toast.success('Security scan complete: No vulnerabilities found');
    } else {
      toast.error(`Security scan complete: ${mockResults.vulnerabilities} vulnerabilities found`);
    }
  };

  return (
    <div className="space-y-4">
      {isScanning && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ScanSearch className="animate-pulse text-blue-500" size={20} />
            <span>Security scan in progress...</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Progress: {Math.round(progress)}%
          </p>
        </div>
      )}

      {scanResults && !isScanning && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {scanResults.vulnerabilities === 0 ? (
              <ShieldCheck className="text-green-500" size={20} />
            ) : (
              <ShieldAlert className="text-red-500" size={20} />
            )}
            <span>Last scan: {scanResults.lastScan}</span>
          </div>
          <p className="text-sm">
            {scanResults.vulnerabilities === 0
              ? "No vulnerabilities detected"
              : `${scanResults.vulnerabilities} vulnerabilities found`}
          </p>
        </div>
      )}

      <button
        onClick={runSecurityScan}
        disabled={isScanning}
        className={`bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors flex items-center gap-2 ${
          isScanning ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Shield size={16} />
        {isScanning ? 'Scanning...' : 'Run Security Scan'}
      </button>
    </div>
  );
};

export default SecurityScan;
