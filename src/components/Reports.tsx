
import React from 'react';
import { FileBarChart, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const reports = [
    { id: 1, name: 'Network Usage Report', date: '2023-04-10', size: '245 KB' },
    { id: 2, name: 'Security Audit Log', date: '2023-04-09', size: '182 KB' },
    { id: 3, name: 'Bandwidth Analysis', date: '2023-04-08', size: '310 KB' },
    { id: 4, name: 'Device Connection History', date: '2023-04-07', size: '198 KB' },
  ];

  return (
    <div className="content-card">
      <div className="flex items-center gap-2 mb-4">
        <FileBarChart size={24} />
        <h2 className="text-xl font-bold">Reports</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Report Name</th>
              <th className="text-left py-2 px-2">Generated Date</th>
              <th className="text-left py-2 px-2">Size</th>
              <th className="text-left py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">{report.name}</td>
                <td className="py-2 px-2">{report.date}</td>
                <td className="py-2 px-2">{report.size}</td>
                <td className="py-2 px-2">
                  <button className="flex items-center gap-1 text-primary hover:text-opacity-80">
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90">
          Generate New Report
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          Schedule Reports
        </button>
      </div>
    </div>
  );
};

export default Reports;
