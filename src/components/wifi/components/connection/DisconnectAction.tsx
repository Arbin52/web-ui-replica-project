
import React from 'react';
import { Button } from "@/components/ui/button";

interface DisconnectActionProps {
  isDisconnecting: boolean;
  onDisconnect: () => void;
}

export const DisconnectAction: React.FC<DisconnectActionProps> = ({ isDisconnecting, onDisconnect }) => {
  return (
    <Button 
      variant="destructive" 
      onClick={onDisconnect}
      disabled={isDisconnecting}
    >
      {isDisconnecting ? "Disconnecting..." : "Disconnect"}
    </Button>
  );
};
