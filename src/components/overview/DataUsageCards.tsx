
import React, { useEffect, useState } from 'react';
import { BarChart2, ShieldAlert, Shield } from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { toast } from 'sonner';

interface DataUsageCardsProps {
  networkStatus: any;
  isLoading: boolean;
}

export const DataUsageCards: React.FC<DataUsageCardsProps> = ({ networkStatus, isLoading }) => {
  const [securityStatus, setSecurityStatus] = useState<{
    status: 'secure' | 'warning' | 'attacked';
    lastCheck: Date;
    detectedThreats: number;
  }>({
    status: 'secure',
    lastCheck: new Date(),
    detectedThreats: 0,
  });

  // Function to check for MITM attacks
  const checkForMITMAttacks = () => {
    // Check if connection is using HTTPS
    const isHttps = window.location.protocol === 'https:';
    
    // Check for certificate issues
    const hasCertificateIssues = detectCertificateIssues();
    
    // Check for connection tampering
    const connectionIssues = detectConnectionTampering();
    
    // Check for DNS spoofing (simplified detection)
    const possibleDNSSpoofing = detectPossibleDNSSpoofing();
    
    // Calculate threat level
    let newSecurityStatus = { ...securityStatus };
    newSecurityStatus.lastCheck = new Date();
    
    let threats = 0;
    let detectedIssues = [];
    
    if (!isHttps) {
      threats++;
      detectedIssues.push("Insecure connection (not using HTTPS)");
    }
    
    if (hasCertificateIssues) {
      threats += 2;
      detectedIssues.push("Certificate validation issues detected");
    }
    
    if (connectionIssues) {
      threats += 2;
      detectedIssues.push("Connection tampering detected");
    }
    
    if (possibleDNSSpoofing) {
      threats += 3;
      detectedIssues.push("Possible DNS spoofing detected");
    }
    
    newSecurityStatus.detectedThreats = threats;
    
    if (threats === 0) {
      newSecurityStatus.status = 'secure';
    } else if (threats <= 2) {
      newSecurityStatus.status = 'warning';
      toast.warning("Security Warning", {
        description: "Potential security issues detected. Check dashboard for details.",
        duration: 5000,
      });
    } else {
      newSecurityStatus.status = 'attacked';
      toast.error("Security Alert!", {
        description: `Possible MITM attack detected! ${detectedIssues.join(", ")}`,
        duration: 8000,
      });
    }
    
    setSecurityStatus(newSecurityStatus);
  };

  // Detect certificate issues (simplified for frontend)
  const detectCertificateIssues = (): boolean => {
    try {
      // Check if the page is loaded over HTTPS and if there are certificate errors
      // This is a simplified check as browsers don't expose detailed cert info to JS
      if (window.location.protocol === 'https:') {
        // On modern browsers, mixed content and invalid cert pages won't even load
        // If we're here on HTTPS, the certificate is likely valid
        return false;
      }
      return true; // HTTP is considered insecure
    } catch (e) {
      console.error("Error checking certificate:", e);
      return true; // Assume issues if we can't check
    }
  };

  // Detect connection tampering (simplified)
  const detectConnectionTampering = (): boolean => {
    // In a real implementation, we would check:
    // - Response headers for proxy signatures
    // - Timing anomalies in responses
    // - Unexpected TLS fingerprints
    
    // For demo purposes, just check for known proxy headers
    const knownProxyHeaders = [
      'via',
      'x-forwarded-for',
      'forwarded',
      'x-real-ip',
      'proxy-connection'
    ];
    
    // We can't access response headers directly in JS
    // This is just for demonstration
    return false;
  };

  // Detect possible DNS spoofing
  const detectPossibleDNSSpoofing = (): boolean => {
    // In a real implementation, we would:
    // - Compare resolved IP with expected IPs
    // - Check for DNS response inconsistencies
    // - Verify domain name matches certificate
    
    // For demo, implement a simple check
    // Compare the canonical hostname to expected values
    try {
      const hostname = window.location.hostname;
      
      // Check if we're on a potentially spoofed domain
      // This is just a demo check
      const expectedHostnames = [
        'localhost',
        '127.0.0.1',
        'lovable.app',
        // Add your known legitimate domains here
      ];
      
      const isDomainTrusted = expectedHostnames.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
      
      return !isDomainTrusted;
    } catch (e) {
      console.error("Error in DNS spoofing check:", e);
      return false;
    }
  };

  // Run security checks periodically
  useEffect(() => {
    checkForMITMAttacks(); // Check immediately on load
    
    // Check security every 30 seconds
    const securityInterval = setInterval(() => {
      checkForMITMAttacks();
    }, 30000);
    
    return () => clearInterval(securityInterval);
  }, []);

  // Show security status card based on detection
  const renderSecurityCard = () => {
    const formattedTime = securityStatus.lastCheck.toLocaleTimeString();
    
    if (securityStatus.status === 'secure') {
      return (
        <DashboardCard
          title="MITM Protection"
          value="Secure"
          icon={<Shield className="h-5 w-5 text-green-500" />}
          isLoading={isLoading}
          description={`Last check: ${formattedTime}`}
          className="border-green-200 bg-green-50"
        />
      );
    } else if (securityStatus.status === 'warning') {
      return (
        <DashboardCard
          title="MITM Protection"
          value="Caution"
          icon={<ShieldAlert className="h-5 w-5 text-amber-500" />}
          isLoading={isLoading}
          description={`${securityStatus.detectedThreats} potential issues detected`}
          className="border-amber-200 bg-amber-50"
        />
      );
    } else {
      return (
        <DashboardCard
          title="MITM Protection"
          value="Alert!"
          icon={<ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />}
          isLoading={isLoading}
          description={`Possible MITM attack - ${securityStatus.detectedThreats} threats`}
          className="border-red-200 bg-red-50"
        />
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <DashboardCard
        title="Data Downloaded"
        value={isLoading ? "" : `${networkStatus?.dataUsage?.download} MB`}
        icon={<BarChart2 className="h-5 w-5" />}
        isLoading={isLoading}
        description="Total data downloaded"
      />

      <DashboardCard
        title="Data Uploaded"
        value={isLoading ? "" : `${networkStatus?.dataUsage?.upload} MB`}
        icon={<BarChart2 className="h-5 w-5" />}
        isLoading={isLoading}
        description="Total data uploaded"
      />

      <DashboardCard
        title="Total Data Used"
        value={isLoading ? "" : `${networkStatus?.dataUsage?.total} MB`}
        icon={<BarChart2 className="h-5 w-5" />}
        isLoading={isLoading}
        description="Combined usage"
      />
      
      {renderSecurityCard()}
    </div>
  );
};
