
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Vulnerability } from './types';

interface ResolvedIssuesProps {
  vulnerabilities: Vulnerability[];
}

const ResolvedIssues: React.FC<ResolvedIssuesProps> = ({ vulnerabilities }) => {
  return (
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
          {vulnerabilities.map((vuln) => (
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
  );
};

export default ResolvedIssues;
