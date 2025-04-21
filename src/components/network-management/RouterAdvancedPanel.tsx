
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export const RouterAdvancedPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl flex items-center">
        <Settings className="h-5 w-5 mr-2" />
        Advanced Settings
      </CardTitle>
      <CardDescription>Configure advanced router features</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-center py-8 text-muted-foreground">
        This is a mock router interface. Advanced settings would be shown here.
      </p>
    </CardContent>
  </Card>
);

