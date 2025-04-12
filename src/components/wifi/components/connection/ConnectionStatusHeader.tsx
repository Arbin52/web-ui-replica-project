
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { CardTitle, CardDescription } from "@/components/ui/card";

interface ConnectionStatusHeaderProps {
  isOnline: boolean;
}

export const ConnectionStatusHeader: React.FC<ConnectionStatusHeaderProps> = ({ isOnline }) => {
  return (
    <>
      <CardTitle className="flex items-center gap-2">
        {isOnline ? 
          <><Wifi className="h-5 w-5 text-green-500" /> Connected</>
          : 
          <><WifiOff className="h-5 w-5 text-red-500" /> Disconnected</>
        }
      </CardTitle>
      <CardDescription>
        Your current WiFi connection status
      </CardDescription>
    </>
  );
};
