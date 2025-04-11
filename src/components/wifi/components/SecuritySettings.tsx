
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Key, Shield, ShieldAlert, ShieldX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const SecuritySettings: React.FC = () => {
  const [securityType, setSecurityType] = useState("WPA3");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const securityLevels = {
    "WPA3": { 
      strength: 100, 
      label: "Most Secure", 
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      description: "Latest security standard with enhanced encryption",
      icon: <ShieldCheck className="h-4 w-4 text-green-600" />
    },
    "WPA2": { 
      strength: 75, 
      label: "Secure", 
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      description: "Good security for most home networks",
      icon: <Shield className="h-4 w-4 text-blue-600" />
    },
    "WPA": { 
      strength: 40, 
      label: "Vulnerable", 
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      description: "Outdated with known vulnerabilities",
      icon: <ShieldAlert className="h-4 w-4 text-amber-600" />
    },
    "NONE": { 
      strength: 0, 
      label: "Not Recommended", 
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      description: "No protection for your network traffic",
      icon: <ShieldX className="h-4 w-4 text-red-600" />
    },
  };

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
            
            {/* Current Security Strength Indicator */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {securityLevels[securityType].icon}
                  <span className="text-sm font-medium">Current Security Level: {securityLevels[securityType].label}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${securityLevels[securityType].color}`}>
                  {securityLevels[securityType].strength}%
                </span>
              </div>
              <Progress value={securityLevels[securityType].strength} className="h-2" />
              <p className="text-xs text-muted-foreground">{securityLevels[securityType].description}</p>
            </div>
            
            <RadioGroup value={securityType} onValueChange={setSecurityType} className="space-y-3">
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="WPA3" id="wpa3" />
                <Label htmlFor="wpa3" className="font-normal flex items-center gap-2">
                  WPA3 {securityLevels["WPA3"].icon}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${securityLevels["WPA3"].color}`}>
                    {securityLevels["WPA3"].label}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="WPA2" id="wpa2" />
                <Label htmlFor="wpa2" className="font-normal flex items-center gap-2">
                  WPA2 {securityLevels["WPA2"].icon}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${securityLevels["WPA2"].color}`}>
                    {securityLevels["WPA2"].label}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="WPA" id="wpa" />
                <Label htmlFor="wpa" className="font-normal flex items-center gap-2">
                  WPA {securityLevels["WPA"].icon}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${securityLevels["WPA"].color}`}>
                    {securityLevels["WPA"].label}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="NONE" id="none" />
                <Label htmlFor="none" className="font-normal flex items-center gap-2">
                  No Security {securityLevels["NONE"].icon}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${securityLevels["NONE"].color}`}>
                    {securityLevels["NONE"].label}
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
          <CardTitle className="text-lg">Security Comparison</CardTitle>
          <CardDescription>
            Compare different WiFi security protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Protocol</th>
                  <th className="text-left py-2 pr-4">Security</th>
                  <th className="text-left py-2 pr-4">Compatibility</th>
                  <th className="text-left py-2">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span>WPA3</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">Strongest</td>
                  <td className="py-2 pr-4">Newer devices (2018+)</td>
                  <td className="py-2"><span className="text-green-600">Recommended</span></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>WPA2</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">Strong</td>
                  <td className="py-2 pr-4">Most devices</td>
                  <td className="py-2"><span className="text-blue-600">Good option</span></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      <span>WPA</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">Vulnerable</td>
                  <td className="py-2 pr-4">Legacy devices</td>
                  <td className="py-2"><span className="text-amber-600">Not recommended</span></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-1">
                      <ShieldX className="h-4 w-4 text-red-600" />
                      <span>None</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">None</td>
                  <td className="py-2 pr-4">All devices</td>
                  <td className="py-2"><span className="text-red-600">Avoid</span></td>
                </tr>
              </tbody>
            </table>
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
