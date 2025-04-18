
import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import UnresolvedIssues from './UnresolvedIssues';
import ResolvedIssues from './ResolvedIssues';
import { Vulnerability } from './types';

interface ScanResultsProps {
  scanResults: {
    vulnerabilities: Vulnerability[];
    status: string;
    lastScan: string;
  };
  onResolve: (id: string) => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ scanResults, onResolve }) => {
  const unresolvedVulnerabilities = scanResults.vulnerabilities.filter(vuln => !vuln.resolved);
  const resolvedVulnerabilities = scanResults.vulnerabilities.filter(vuln => vuln.resolved);

  return (
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
            <UnresolvedIssues 
              vulnerabilities={unresolvedVulnerabilities} 
              onResolve={onResolve} 
            />
          )}

          {resolvedVulnerabilities.length > 0 && (
            <ResolvedIssues 
              vulnerabilities={resolvedVulnerabilities} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ScanResults;
