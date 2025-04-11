
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NetworkNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customNetworkName: string;
  setCustomNetworkName: (name: string) => void;
  onSave: () => void;
}

const NetworkNameDialog: React.FC<NetworkNameDialogProps> = ({
  open,
  onOpenChange,
  customNetworkName,
  setCustomNetworkName,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Network Name</DialogTitle>
          <DialogDescription>
            Enter the actual name of the network you're connected to
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="networkName">Network Name</Label>
            <Input 
              id="networkName" 
              type="text" 
              placeholder="Enter network name" 
              value={customNetworkName}
              onChange={(e) => setCustomNetworkName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            disabled={!customNetworkName.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkNameDialog;
