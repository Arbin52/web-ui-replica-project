
import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

  const checkSecurity = () => {
    const status = getSecurityStatus();
    setSecurityStatus(status);
    
    const mitmTest = testForMITMAttacks();
    setMitm(mitmTest);

    if (mitmTest.isUnderAttack) {
      toast.error("Potential MITM Attack Detected!", {
        description: mitmTest.issues.join(". "),
        duration: 8000,
      });
    }
  };

  useEffect(() => {
    checkSecurity();
    const interval = setInterval(checkSecurity, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!securityStatus) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mitm.isUnderAttack ? (
            <ShieldAlert className="h-5 w-5 text-destructive" />
          ) : (
            <Shield className="h-5 w-5 text-green-500" />
          )}
          MITM Protection Status
        </CardTitle>
        <CardDescription>
          Real-time monitoring for Man-in-the-Middle attacks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mitm.isUnderAttack ? (
          <Alert variant="destructive">
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
              No MITM attacks detected. Your connection is being monitored.
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

        <div className="pt-4">
          <Button onClick={checkSecurity} className="w-full">
            <Shield className="mr-2 h-4 w-4" />
            Run Security Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitoring;
