
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const RouterSecurityPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl flex items-center">
        <Shield className="h-5 w-5 mr-2" />
        Security Settings
      </CardTitle>
      <CardDescription>Configure firewall and security features</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-center py-8 text-muted-foreground">
        This is a mock router interface. Security settings would be shown here.
      </p>
    </CardContent>
  </Card>
);

