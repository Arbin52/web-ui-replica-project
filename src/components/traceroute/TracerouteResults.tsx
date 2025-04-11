
import React, { useState } from 'react';
import { Signal, AlertCircle, Globe, Server, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { calculateJitter, calculatePacketLoss, exportToCSV, exportToJSON } from './utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export interface HopResult {
  hop: number;
  ipAddress: string;
  hostName: string | null;
  responseTime1: number | null;
  responseTime2: number | null;
  responseTime3: number | null;
  status: 'success' | 'timeout' | 'error';
  country?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  isp?: string;
  asn?: string;
}

interface TracerouteResultsProps {
  results: HopResult[];
}

export const TracerouteResults: React.FC<TracerouteResultsProps> = ({
  results
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
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
  
  const toggleRowExpansion = (hopIndex: number) => {
    setExpandedRow(expandedRow === hopIndex ? null : hopIndex);
  };
  
  const handleExportResults = (format: 'csv' | 'json') => {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;
      
      if (format === 'csv') {
        content = exportToCSV(results);
        filename = 'traceroute-results.csv';
        mimeType = 'text/csv';
      } else {
        content = exportToJSON(results);
        filename = 'traceroute-results.json';
        mimeType = 'application/json';
      }
      
      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Results exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export results');
      console.error('Export error:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Traceroute Results</h3>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleExportResults('csv')}
              >
                <Download size={14} /> CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as CSV</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleExportResults('json')}
              >
                <Download size={14} /> JSON
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as JSON</TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Hop</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="hidden md:table-cell">Hostname</TableHead>
            <TableHead>Response Time (ms)</TableHead>
            <TableHead className="w-20">Status</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((hop, index) => (
            <React.Fragment key={index}>
              <TableRow 
                className={`${hop.status === 'timeout' ? 'bg-gray-50' : ''} cursor-pointer`}
                onClick={() => toggleRowExpansion(index)}
              >
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
                <TableCell className="hidden md:table-cell">
                  {hop.country && hop.city ? (
                    <span className="flex items-center">
                      <Globe size={16} className="mr-1 text-blue-500" />
                      {hop.city}, {hop.country}
                    </span>
                  ) : (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </TableCell>
              </TableRow>
              
              {expandedRow === index && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={6} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Network Details</h4>
                        <div className="grid gap-1 text-sm">
                          <div className="flex items-center">
                            <Server size={14} className="mr-1 text-gray-500" />
                            <span className="font-semibold mr-2">ISP:</span>
                            {hop.isp || "Unknown"}
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">ASN:</span>
                            {hop.asn || "Unknown"}
                          </div>
                          {hop.latitude && hop.longitude && (
                            <div>
                              <span className="font-semibold mr-2">Coordinates:</span>
                              {hop.latitude}, {hop.longitude}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                        <div className="grid gap-1 text-sm">
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">Avg Response:</span>
                            {calculateAverageTime(hop)?.toFixed(2) || "N/A"} ms
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">Jitter:</span>
                            {calculateJitter([hop.responseTime1, hop.responseTime2, hop.responseTime3])} ms
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">Packet Loss:</span>
                            {calculatePacketLoss([hop.responseTime1, hop.responseTime2, hop.responseTime3])}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
