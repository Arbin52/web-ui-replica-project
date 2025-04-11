
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import NetworkList from '../components/NetworkList';
import AddNetworkDialog from '../components/AddNetworkDialog';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useNetworks } from '@/hooks/useNetworks';

const NetworkManagement = () => {
  const [activeTab, setActiveTab] = React.useState('networks');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { networks, loading, fetchNetworks } = useNetworks();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-grow">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-grow">
          <div className="max-w-screen-xl mx-auto p-4 md:p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Network Management</h1>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Network
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
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
                    onClick={() => setIsAddDialogOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2 mx-auto"
                  >
                    <PlusCircle size={16} />
                    Add Your First Network
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AddNetworkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onNetworkAdded={fetchNetworks}
      />
    </div>
  );
};

export default NetworkManagement;
