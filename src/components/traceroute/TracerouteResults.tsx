
import React from 'react';
import { Signal, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface HopResult {
  hop: number;
  ipAddress: string;
  hostName: string | null;
  responseTime1: number | null;
  responseTime2: number | null;
  responseTime3: number | null;
  status: 'success' | 'timeout' | 'error';
}

interface TracerouteResultsProps {
  results: HopResult[];
}

export const TracerouteResults: React.FC<TracerouteResultsProps> = ({
  results
}) => {
  if (results.length === 0) return null;
  
  const getHopStatusColor = (hop: HopResult) => {
    if (hop.status === 'error' || hop.status === 'timeout') return "text-red-600";
    
    const avgTime = calculateAverageTime(hop);
    if (!avgTime) return "text-gray-400";
    if (avgTime < 20) return "text-green-600";
    if (avgTime < 50) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateAverageTime = (hop: HopResult) => {
    const times = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null) as number[];
    if (times.length === 0) return null;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Hop</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="hidden md:table-cell">Hostname</TableHead>
            <TableHead>Response Time (ms)</TableHead>
            <TableHead className="w-20">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((hop, index) => (
            <TableRow key={index} className={hop.status === 'timeout' ? 'bg-gray-50' : ''}>
              <TableCell className="font-mono">{hop.hop}</TableCell>
              <TableCell className="font-mono">{hop.ipAddress}</TableCell>
              <TableCell className="hidden md:table-cell">{hop.hostName || <span className="text-gray-400">Not resolved</span>}</TableCell>
              <TableCell>
                <div className="flex gap-1 font-mono">
                  <span className={hop.responseTime1 ? '' : 'text-gray-400'}>
                    {hop.responseTime1 || '*'}
                  </span>
                  <span className="mx-1 text-gray-400">|</span>
                  <span className={hop.responseTime2 ? '' : 'text-gray-400'}>
                    {hop.responseTime2 || '*'}
                  </span>
                  <span className="mx-1 text-gray-400">|</span>
                  <span className={hop.responseTime3 ? '' : 'text-gray-400'}>
                    {hop.responseTime3 || '*'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {hop.status === 'timeout' ? (
                  <span className="flex items-center text-yellow-500">
                    <AlertCircle size={16} className="mr-1" /> Timeout
                  </span>
                ) : hop.status === 'error' ? (
                  <span className="flex items-center text-red-500">
                    <AlertCircle size={16} className="mr-1" /> Error
                  </span>
                ) : (
                  <span className={`flex items-center ${getHopStatusColor(hop)}`}>
                    <Signal size={16} className="mr-1" /> OK
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
