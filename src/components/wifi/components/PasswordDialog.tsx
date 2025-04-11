
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

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
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear error when user types
    if (passwordError) setPasswordError('');
  };

  const validateAndSubmit = () => {
    // Basic validation - most WiFi passwords require at least 8 characters
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    // Store the selected network name for real-time detection simulation
    if (selectedNetwork) {
      localStorage.setItem('last_connected_network', selectedNetwork.ssid);
    }
    
    handleSubmitPassword();
  };

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
              onChange={handlePasswordChange}
              className={passwordError ? "border-red-500" : ""}
            />
            {passwordError && (
              <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                <AlertCircle className="h-4 w-4" />
                {passwordError}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Password should be at least 8 characters long
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setPasswordError('');
              setShowPasswordDialog(false);
            }}
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button 
            onClick={validateAndSubmit}
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
