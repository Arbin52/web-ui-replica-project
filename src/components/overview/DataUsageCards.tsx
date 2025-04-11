
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';

interface DataUsageCardsProps {
  networkStatus: any;
  isLoading: boolean;
}

export const DataUsageCards: React.FC<DataUsageCardsProps> = ({ networkStatus, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <DashboardCard
        title="Data Downloaded"
        value={isLoading ? "" : `${networkStatus?.dataUsage?.download} MB`}
        icon={<BarChart2 className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Data Uploaded"
        value={isLoading ? "" : `${networkStatus?.dataUsage?.upload} MB`}
        icon={<BarChart2 className="h-5 w-5" />}
        isLoading={isLoading}
      />

      <DashboardCard
        title="Total Data Used"
        value={isLoading ? "" : `${networkStatus?.dataUsage?.total} MB`}
        icon={<BarChart2 className="h-5 w-5" />}
        isLoading={isLoading}
      />
    </div>
  );
};
