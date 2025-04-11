
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const SecuritySettings: React.FC = () => {
  const [securityType, setSecurityType] = useState("WPA3");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    if (securityType === "NONE" || (password && password.length >= 8)) {
      setIsLoading(true);
      
      // Simulate API call to save settings
      setTimeout(() => {
        setIsLoading(false);
        toast.success(`WiFi security type changed to ${securityType}`);
        
        // Store the security type in localStorage for simulation purposes
        localStorage.setItem('wifi_security_type', securityType);
      }, 1500);
    } else if (securityType !== "NONE" && (!password || password.length < 8)) {
      toast.error("Password must be at least 8 characters for secured networks");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck size={20} />
            WiFi Security Settings
          </CardTitle>
          <CardDescription>
            Configure the security settings for your WiFi network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="font-medium">Security Type</div>
            <RadioGroup value={securityType} onValueChange={setSecurityType} className="space-y-3">
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="WPA3" id="wpa3" />
                <Label htmlFor="wpa3" className="font-normal flex items-center gap-2">
                  WPA3 (Recommended)
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                    Most Secure
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="WPA2" id="wpa2" />
                <Label htmlFor="wpa2" className="font-normal">WPA2</Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="WPA" id="wpa" />
                <Label htmlFor="wpa" className="font-normal">WPA</Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="NONE" id="none" />
                <Label htmlFor="none" className="font-normal flex items-center gap-2">
                  No Security 
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-100">
                    Not Recommended
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {securityType !== "NONE" && (
            <div className="space-y-4">
              <div className="font-medium flex items-center gap-2">
                <Key size={16} />
                Network Password
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Enter WiFi password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Security Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security Recommendations</CardTitle>
          <CardDescription>
            Follow these guidelines for a more secure network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use WPA3 whenever possible for maximum security</li>
            <li>Create a strong password with at least 12 characters</li>
            <li>Include numbers, symbols, and mixed case letters</li>
            <li>Change your WiFi password periodically</li>
            <li>Enable MAC address filtering for additional security</li>
            <li>Disable WPS (WiFi Protected Setup) if not needed</li>
            <li>Keep your router firmware up to date</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
