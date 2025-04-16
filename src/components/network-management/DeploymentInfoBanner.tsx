
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeploymentInfoBannerProps {
  isDeployed: boolean;
}

export const DeploymentInfoBanner: React.FC<DeploymentInfoBannerProps> = ({ isDeployed }) => {
  if (!isDeployed) return null;
  
  return (
    <Alert variant="warning" className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
      <AlertCircle className="h-5 w-5 text-amber-800" />
      <AlertTitle className="text-amber-800 font-medium">Limited Functionality in Deployed Mode</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          You're viewing this application on a deployed website where some features are limited.
          Network scanning functionality requires running the application locally on your computer with
          the scanner service active.
        </p>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-amber-300 hover:bg-amber-100 text-amber-900"
            onClick={() => window.open('https://github.com/your-repo/local-network-scanner', '_blank')}
          >
            Download Scanner <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-amber-300 hover:bg-amber-100 text-amber-900"
            onClick={() => window.open('https://github.com/your-repo/network-monitor', '_blank')}
          >
            Run Locally <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
