
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Network, useNetworks } from '@/hooks/useNetworks';
import { MoreHorizontal, Trash, Edit } from 'lucide-react';
import { format } from 'date-fns';
import EditNetworkDialog from './EditNetworkDialog';
import { toast } from 'sonner';

interface NetworkListProps {
  networks: Network[];
  onRefresh: () => void;
}

const NetworkList: React.FC<NetworkListProps> = ({ networks, onRefresh }) => {
  const [networkToDelete, setNetworkToDelete] = useState<string | null>(null);
  const [networkToEdit, setNetworkToEdit] = useState<Network | null>(null);
  const { deleteNetwork } = useNetworks();
  
  const handleDelete = async () => {
    if (networkToDelete) {
      try {
        await deleteNetwork(networkToDelete);
        toast.success('Network deleted successfully');
        onRefresh();
      } catch (error) {
        console.error('Error deleting network:', error);
        toast.error('Failed to delete network');
      } finally {
        setNetworkToDelete(null);
      }
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Network Name</TableHead>
            <TableHead className="hidden md:table-cell">SSID</TableHead>
            <TableHead className="hidden md:table-cell">Gateway IP</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {networks.map((network) => (
            <TableRow key={network.id}>
              <TableCell className="font-medium">{network.name}</TableCell>
              <TableCell className="hidden md:table-cell">{network.ssid || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{network.gateway_ip || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">
                {network.created_at ? format(new Date(network.created_at), 'MMM d, yyyy') : '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => setNetworkToEdit(network)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setNetworkToDelete(network.id)} 
                      className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!networkToDelete} onOpenChange={() => setNetworkToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Network</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this network? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Network Dialog */}
      <EditNetworkDialog
        network={networkToEdit}
        open={!!networkToEdit}
        onOpenChange={() => setNetworkToEdit(null)}
        onNetworkUpdated={onRefresh}
      />
    </>
  );
};

export default NetworkList;
