
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import NetworkList from '../NetworkList';
import { Network } from '@/hooks/useNetworks';

interface SavedNetworksProps {
  networks: Network[];
  loading: boolean;
  fetchNetworks: () => void;
  openAddNetworkDialog: () => void;
}

export const SavedNetworks: React.FC<SavedNetworksProps> = ({
  networks,
  loading,
  fetchNetworks,
  openAddNetworkDialog
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Networks</CardTitle>
        <CardDescription>
          Your saved network configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : networks.length > 0 ? (
            <NetworkList networks={networks} onRefresh={fetchNetworks} />
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Networks Found</h3>
              <p className="text-gray-500 mb-4">You haven't added any networks yet.</p>
              <Button 
                onClick={openAddNetworkDialog}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <PlusCircle size={16} />
                Add Your First Network
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
