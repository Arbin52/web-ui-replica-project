
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PasswordDialogProps {
  showPasswordDialog: boolean;
  setShowPasswordDialog: (show: boolean) => void;
  selectedNetwork: { id: number, ssid: string } | null;
  password: string;
  setPassword: (password: string) => void;
  handleSubmitPassword: () => void;
  isConnecting: boolean;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({
  showPasswordDialog,
  setShowPasswordDialog,
  selectedNetwork,
  password,
  setPassword,
  handleSubmitPassword,
  isConnecting
}) => {
  return (
    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to {selectedNetwork?.ssid}</DialogTitle>
          <DialogDescription>
            Enter the password for this network to connect.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter network password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowPasswordDialog(false)}
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitPassword}
            disabled={!password || isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
