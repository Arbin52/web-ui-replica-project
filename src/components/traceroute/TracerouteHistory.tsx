
import React, { useState } from 'react';
import { Clock, Calendar, Delete, ChevronDown, ChevronUp, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { HopResult } from './TracerouteResults';
import { exportToJSON } from './utils';

export interface TracerouteHistoryItem {
  id: string;
  timestamp: Date;
  targetHost: string;
  hops: number;
  avgLatency: number;
  status: 'success' | 'partial' | 'failed';
  results: HopResult[];
}

interface TracerouteHistoryProps {
  historyItems: TracerouteHistoryItem[];
  onSelectHistoryItem: (results: HopResult[]) => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const TracerouteHistory: React.FC<TracerouteHistoryProps> = ({
  historyItems,
  onSelectHistoryItem,
  onDeleteHistoryItem
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  if (historyItems.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <Clock className="mx-auto mb-2 text-gray-400" size={24} />
        <p className="text-gray-500">No traceroute history available</p>
        <p className="text-sm text-gray-400 mt-1">Previous traces will be saved here</p>
      </div>
    );
  }
  
  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };
  
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  const getStatusBadge = (status: 'success' | 'partial' | 'failed') => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return null;
    }
  };
  
  const handleExportTrace = (traceItem: TracerouteHistoryItem) => {
    try {
      const content = exportToJSON(traceItem.results);
      const filename = `traceroute-${traceItem.targetHost}-${new Date(traceItem.timestamp).toISOString().split('T')[0]}.json`;
      const mimeType = 'application/json';
      
      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Trace exported as JSON`);
    } catch (error) {
      toast.error('Failed to export trace');
      console.error('Export error:', error);
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Calendar size={18} />
        Trace History
      </h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Hops</TableHead>
            <TableHead>Avg Latency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyItems.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow className="cursor-pointer hover:bg-gray-50">
                <TableCell className="py-2" onClick={() => toggleExpand(item.id)}>
                  {expandedItem === item.id ? 
                    <ChevronUp size={16} className="text-gray-500" /> : 
                    <ChevronDown size={16} className="text-gray-500" />
                  }
                </TableCell>
                <TableCell className="font-medium" onClick={() => toggleExpand(item.id)}>
                  {formatDateTime(item.timestamp)}
                </TableCell>
                <TableCell className="font-mono" onClick={() => toggleExpand(item.id)}>
                  {item.targetHost}
                </TableCell>
                <TableCell onClick={() => toggleExpand(item.id)}>{item.hops}</TableCell>
                <TableCell onClick={() => toggleExpand(item.id)}>{item.avgLatency.toFixed(2)} ms</TableCell>
                <TableCell onClick={() => toggleExpand(item.id)}>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectHistoryItem(item.results)}
                      className="h-8 px-2 text-xs"
                    >
                      Compare
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExportTrace(item)}
                      className="h-8 px-2 text-xs"
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Delete size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedItem === item.id && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={7} className="p-4">
                    <div className="text-sm">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-gray-500">First Hop</div>
                          <div className="font-mono">
                            {item.results[0]?.ipAddress || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Last Hop</div>
                          <div className="font-mono">
                            {item.results[item.results.length - 1]?.ipAddress || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Route</div>
                          <div className="font-mono">
                            {item.results
                              .filter(hop => hop.country)
                              .map(hop => hop.country)
                              .filter((country, index, self) => 
                                index === self.findIndex(c => c === country)
                              )
                              .slice(0, 3)
                              .join(' → ')
                            }
                            {item.results.filter(hop => hop.country).length > 3 ? ' → ...' : ''}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">ISPs</div>
                          <div className="font-mono">
                            {item.results
                              .filter(hop => hop.isp)
                              .map(hop => hop.isp)
                              .filter((isp, index, self) => 
                                index === self.findIndex(i => i === isp)
                              )
                              .slice(0, 2)
                              .join(', ')
                            }
                            {item.results.filter(hop => hop.isp).length > 2 ? ', ...' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          onClick={() => onSelectHistoryItem(item.results)}
                          variant="outline"
                          size="sm"
                        >
                          View Full Details
                        </Button>
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
