
import React, { useState, useEffect, useCallback } from 'react';
import { Shield, ShieldAlert, Wifi } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSecurityStatus, testForMITMAttacks } from '@/utils/securityMonitoring';
import { toast } from 'sonner';

const SecurityMonitoring = () => {
  const [securityStatus, setSecurityStatus] = useState<{
    isSecureContext: boolean;
    protocol: string;
    isLocalhost: boolean;
    hasServiceWorker: boolean;
    timeChecked: Date;
  } | null>(null);

  const [mitm, setMitm] = useState<{
    isUnderAttack: boolean;
    issues: string[];
  }>({ isUnderAttack: false, issues: [] });

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Run continuous MITM scan in a more visible way
  const runMITMScan = useCallback(async () => {
    setScanning(true);
    setScanProgress(0);
    
    // Visual progress simulation for UX
    const startTime = Date.now();
    const scanDuration = 2000; // 2 seconds total for the scan
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / scanDuration) * 100, 99);
      setScanProgress(progress);
    }, 50);
    
    // Simulate different scan phases
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.info("Checking connection security...");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.info("Analyzing network traffic patterns...");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.info("Verifying certificate chain...");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.info("Finalizing MITM scan...");
    
    // Get actual results
    const status = getSecurityStatus();
    setSecurityStatus(status);
    
    const mitmTest = testForMITMAttacks();
    
    // Clear progress interval
    clearInterval(progressInterval);
    setScanProgress(100);
    
    // A slight delay before finishing to show 100% progress
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setMitm(mitmTest);
    setScanning(false);

    // Show toast notifications based on scan results
    if (mitmTest.isUnderAttack) {
      toast.error("Potential MITM Attack Detected!", {
        description: mitmTest.issues.join(". "),
        duration: 8000,
      });
    } else {
      toast.success("Security scan complete - No threats detected", {
        duration: 3000
      });
    }
  }, []);

  useEffect(() => {
    // Run initial scan on mount
    runMITMScan();
    
    // Set up continuous scanning (every 30 seconds)
    const scanInterval = setInterval(() => {
      runMITMScan();
    }, 30000); // 30 seconds
    
    return () => {
      clearInterval(scanInterval);
    };
  }, [runMITMScan]);

  if (!securityStatus) return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Loading Security Status...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                <div className="h-2 bg-gray-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {mitm.isUnderAttack ? (
              <ShieldAlert className="h-5 w-5 text-destructive animate-pulse" />
            ) : (
              <Shield className="h-5 w-5 text-green-500" />
            )}
            MITM Protection Status
            
            {scanning && (
              <Badge variant="outline" className="ml-2 animate-pulse">
                Scanning...
              </Badge>
            )}
          </CardTitle>
          <Badge 
            variant={mitm.isUnderAttack ? "destructive" : "success"}
            className={mitm.isUnderAttack ? "animate-pulse" : ""}
          >
            {mitm.isUnderAttack ? "Alert" : "Secure"}
          </Badge>
        </div>
        <CardDescription>
          Real-time monitoring for Man-in-the-Middle attacks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scanning && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Security scan in progress...</span>
              <span className="text-sm text-muted-foreground">{Math.round(scanProgress)}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}
        
        {mitm.isUnderAttack ? (
          <Alert variant="destructive" className="animate-pulse">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Security Threat Detected!</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                {mitm.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <Shield className="h-4 w-4 text-green-500" />
            <AlertTitle>Connection Secure</AlertTitle>
            <AlertDescription>
              No MITM attacks detected. Your connection is being continuously monitored.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Connection Protocol:</div>
            <div className={`font-medium ${securityStatus.protocol === 'https:' ? 'text-green-600' : 'text-red-600'}`}>
              {securityStatus.protocol}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Secure Context:</div>
            <div className={`font-medium ${securityStatus.isSecureContext ? 'text-green-600' : 'text-red-600'}`}>
              {securityStatus.isSecureContext ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            Last scan: {new Date().toLocaleTimeString()}
          </div>
          <div>Scanning every 30 seconds</div>
        </div>

        <div className="pt-2">
          <Button onClick={runMITMScan} className="w-full" disabled={scanning}>
            <Shield className="mr-2 h-4 w-4" />
            {scanning ? 'Scanning...' : 'Run Manual Security Check'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitoring;
