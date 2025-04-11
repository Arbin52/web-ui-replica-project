
import React, { useState } from 'react';
import { FileBarChart, Download, FileText, Table, Calendar, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const Reports: React.FC = () => {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const reports = [
    { id: 1, name: 'Network Usage Report', date: '2023-04-10', size: '245 KB', type: 'Network' },
    { id: 2, name: 'Security Audit Log', date: '2023-04-09', size: '182 KB', type: 'Security' },
    { id: 3, name: 'Bandwidth Analysis', date: '2023-04-08', size: '310 KB', type: 'Performance' },
    { id: 4, name: 'Device Connection History', date: '2023-04-07', size: '198 KB', type: 'Devices' },
    { id: 5, name: 'Monthly Traffic Summary', date: '2023-04-06', size: '275 KB', type: 'Network' },
    { id: 6, name: 'Intrusion Detection Logs', date: '2023-04-05', size: '320 KB', type: 'Security' },
  ];

  const handleDownload = (reportId: number, format: 'pdf' | 'csv') => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    
    toast({
      title: "Download started",
      description: `Downloading ${report.name} in ${format.toUpperCase()} format`,
    });
    
    // This would be replaced with actual download logic in a real application
    console.log(`Downloading report ${reportId} in ${format} format`);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report generation initiated",
      description: "Your new report is being generated. It will appear in the list shortly.",
    });
  };
  
  const handleScheduleReport = () => {
    toast({
      title: "Schedule reports",
      description: "The scheduling interface will be implemented in a future update.",
    });
  };

  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileBarChart size={24} className="text-primary" />
          <h2 className="text-xl font-bold">Reports</h2>
        </div>
        <div className="flex gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={16} />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Reports</SheetTitle>
                <SheetDescription>
                  Filter reports by date, type, and more.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Report Type</label>
                  <select id="type" className="border rounded p-2">
                    <option value="">All Types</option>
                    <option value="Network">Network</option>
                    <option value="Security">Security</option>
                    <option value="Performance">Performance</option>
                    <option value="Devices">Devices</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date Range</label>
                  <div className="flex gap-2">
                    <input type="date" className="border rounded p-2 flex-1" />
                    <span className="self-center">to</span>
                    <input type="date" className="border rounded p-2 flex-1" />
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Date Range</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border mb-6">
        <UITable>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Generated Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow 
                key={report.id} 
                className="hover:bg-muted/50 transition-colors group"
              >
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.size}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 h-8"
                      onClick={() => handleDownload(report.id, 'pdf')}
                    >
                      <FileText size={16} />
                      <span>PDF</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 h-8"
                      onClick={() => handleDownload(report.id, 'csv')}
                    >
                      <Table size={16} />
                      <span>CSV</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button 
          className="hover:scale-105 transition-transform"
          onClick={handleGenerateReport}
        >
          Generate New Report
        </Button>
        <Button 
          variant="secondary" 
          className="hover:scale-105 transition-transform"
          onClick={handleScheduleReport}
        >
          Schedule Reports
        </Button>
      </div>
    </div>
  );
};

export default Reports;
