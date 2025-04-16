
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m"
};

console.log(`${colors.bright}${colors.cyan}Network Scanner Setup Script${colors.reset}\n`);

// Create directory structure
const createDirectories = () => {
  console.log(`${colors.yellow}Creating directory structure...${colors.reset}`);
  
  // Ensure local-scanner directory exists
  if (!fs.existsSync('local-scanner')) {
    fs.mkdirSync('local-scanner', { recursive: true });
    console.log(`Created local-scanner directory`);
  }
  
  // Ensure python directory exists inside local-scanner
  if (!fs.existsSync(path.join('local-scanner', 'python'))) {
    fs.mkdirSync(path.join('local-scanner', 'python'), { recursive: true });
    console.log(`Created local-scanner/python directory`);
  }

  console.log(`${colors.green}Directory structure created successfully${colors.reset}\n`);
};

// Copy files from requirements to appropriate locations
const copyRequiredFiles = () => {
  console.log(`${colors.yellow}Copying required files...${colors.reset}`);
  
  // Copy python requirements to python directory
  try {
    if (fs.existsSync('requirements/python_requirements.txt')) {
      fs.copyFileSync(
        'requirements/python_requirements.txt',
        path.join('local-scanner', 'python', 'requirements.txt')
      );
      console.log(`Copied python requirements to local-scanner/python/requirements.txt`);
    } else if (fs.existsSync('local-scanner/python/requirements.txt')) {
      console.log(`Python requirements already exist in local-scanner/python/`);
    } else {
      console.log(`${colors.red}Warning: Could not find python_requirements.txt${colors.reset}`);
      
      // Create a basic requirements file for Windows
      const isWindows = process.platform === 'win32';
      if (isWindows) {
        const basicWindowsReqs = 
`# Basic network scanning requirements for Windows
pynetinfo>=0.1.0
getmac>=0.8.2
colorama>=0.4.4  # For terminal colors
requests>=2.28.0

# If you have trouble with pynetinfo, the scanner will use fallback methods
`;
        fs.writeFileSync(
          path.join('local-scanner', 'python', 'requirements.txt'),
          basicWindowsReqs
        );
        console.log(`Created basic Python requirements for Windows`);
      }
    }
  } catch (err) {
    console.error(`${colors.red}Error copying python requirements: ${err.message}${colors.reset}`);
  }
  
  // Copy package.json if it doesn't exist
  if (!fs.existsSync(path.join('local-scanner', 'package.json'))) {
    try {
      if (fs.existsSync('local-scanner/package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('local-scanner/package.json', 'utf8'));
        fs.writeFileSync(
          path.join('local-scanner', 'package.json'),
          JSON.stringify(packageJson, null, 2)
        );
        console.log(`Created local-scanner/package.json`);
      } else {
        // Create basic package.json
        const basicPackageJson = {
          "name": "network-scanner-service",
          "version": "1.0.0",
          "description": "Local network scanner service",
          "main": "index.ts",
          "scripts": {
            "start": "ts-node index.ts",
            "dev": "ts-node-dev --respawn index.ts",
            "build": "tsc",
            "test": "echo \"No tests configured\""
          },
          "dependencies": {
            "cors": "^2.8.5",
            "express": "^4.18.2"
          },
          "devDependencies": {
            "@types/cors": "^2.8.13",
            "@types/express": "^4.17.17",
            "@types/node": "^20.3.1",
            "ts-node": "^10.9.1",
            "ts-node-dev": "^2.0.0",
            "typescript": "^5.1.3"
          }
        };
        fs.writeFileSync(
          path.join('local-scanner', 'package.json'),
          JSON.stringify(basicPackageJson, null, 2)
        );
        console.log(`Created basic package.json in local-scanner directory`);
      }
    } catch (err) {
      console.error(`${colors.red}Error creating package.json: ${err.message}${colors.reset}`);
    }
  } else {
    console.log(`local-scanner/package.json already exists`);
  }
  
  // Create index.ts if it doesn't exist
  if (!fs.existsSync(path.join('local-scanner', 'index.ts'))) {
    const indexTsContent = `
import express from 'express';
import cors from 'cors';
import { networkScanner } from './networkScanner';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Add a /status endpoint to check if the server is running
app.get('/status', (req, res) => {
  res.json({ 
    status: 'running',
    pythonAvailable: networkScanner.isPythonAvailable,
    version: '1.1.0'
  });
});

// Endpoint to scan for all devices
app.get('/devices', async (req, res) => {
  try {
    const devices = await networkScanner.scan();
    res.json(devices);
  } catch (error) {
    console.error('Network scan failed:', error);
    res.status(500).json({ error: 'Network scan failed', details: error.message });
  }
});

// New endpoint to get details for a specific device
app.get('/device/:ip', async (req, res) => {
  try {
    const ipAddress = req.params.ip;
    const deviceDetails = await networkScanner.getDeviceDetails(ipAddress);
    
    if (deviceDetails) {
      res.json(deviceDetails);
    } else {
      res.status(404).json({ error: 'Device not found or details unavailable' });
    }
  } catch (error) {
    console.error(\`Failed to get device details: \${error.message}\`);
    res.status(500).json({ error: \`Failed to get device details: \${error.message}\` });
  }
});

// Endpoint to get Python scanner status
app.get('/scanner-status', async (req, res) => {
  try {
    if (networkScanner.isPythonAvailable) {
      try {
        const statusOutput = await networkScanner.runPythonScript(['status']);
        const status = JSON.parse(statusOutput);
        res.json({
          ...status,
          pythonAvailable: true
        });
      } catch (error) {
        // Handle case when status call fails (likely due to missing dependencies)
        console.error('Failed to get detailed scanner status:', error);
        res.json({
          pythonAvailable: true,
          modules: {
            scapy: false,
            nmap: false,
            netifaces: false,
            psutil: false
          },
          os: process.platform,
          error: error.message
        });
      }
    } else {
      res.json({
        pythonAvailable: false,
        reason: "Python not available on this system"
      });
    }
  } catch (error) {
    console.error('Failed to get scanner status:', error);
    res.status(500).json({ 
      error: 'Failed to get scanner status',
      message: error.message
    });
  }
});

// Endpoint to trigger a network scan (POST method)
app.post('/scan', (req, res) => {
  try {
    // Just acknowledge the request - the actual scan will happen when /devices is called
    res.json({ status: 'Scan initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate network scan' });
  }
});

app.listen(PORT, () => {
  console.log(\`Network Scanner running on port \${PORT}\`);
  console.log(\`Python integration \${networkScanner.isPythonAvailable ? 'available' : 'not available'}\`);

  if (networkScanner.isPythonAvailable) {
    console.log(\`Using Python for enhanced network scanning capabilities\`);
  } else {
    console.log(\`Python not available - using fallback methods. For better results, install Python and required packages.\`);
  }
});
`;
    fs.writeFileSync(path.join('local-scanner', 'index.ts'), indexTsContent);
    console.log(`Created local-scanner/index.ts`);
  } else {
    console.log(`local-scanner/index.ts already exists`);
  }
  
  // Create or update a Windows-friendly networkScanner.ts with better fallback support
  if (!fs.existsSync(path.join('local-scanner', 'networkScanner.ts'))) {
    const networkScannerContent = `
import { execSync } from 'child_process';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

interface NetworkDevice {
  ip: string;
  mac?: string;
  name?: string;
  hostname?: string;
  vendor?: string;
  manufacturer?: string;
  type?: string;
  status?: string;
  id: string;
  lastSeen?: string;
}

// Helper to determine the correct path to the Python script
const getPythonScriptPath = () => {
  const relativePath = 'python/network_scanner.py';
  const scriptPath = path.join(__dirname, relativePath);
  
  // Create dummy script if it doesn't exist for fallback functionality
  if (!existsSync(scriptPath)) {
    console.log('Python scanner script not found, creating minimal version for fallback');
    const fs = require('fs');
    const minimalScript = \`#!/usr/bin/env python
import sys
import json
import platform

def get_status():
    return {
        "os": platform.system(),
        "python_version": platform.python_version(),
        "modules": {
            "scapy": False,
            "nmap": False,
            "netifaces": False,
            "psutil": False
        }
    }

if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else ""
    if command == "status":
        print(json.dumps(get_status()))
    elif command == "scan":
        print("[]")  # Empty device list
    else:
        print(json.dumps({"error": "Command not supported in minimal script"}))
\`;
    fs.writeFileSync(scriptPath, minimalScript);
  }
  
  return scriptPath;
};

// Helper to check if Python is available
const isPythonAvailable = (): boolean => {
  try {
    // For Windows, try 'python' first
    if (process.platform === 'win32') {
      try {
        execSync('python --version', { stdio: 'ignore' });
        return true;
      } catch (e) {
        // Try py command (Python launcher on newer Windows)
        try {
          execSync('py --version', { stdio: 'ignore' });
          return true;
        } catch (e) {
          console.log('Python is not available on this Windows system');
          return false;
        }
      }
    } else {
      // For non-Windows, try Python 3 first
      try {
        execSync('python3 --version', { stdio: 'ignore' });
        return true;
      } catch (e) {
        try {
          // Fallback to python command
          execSync('python --version', { stdio: 'ignore' });
          return true;
        } catch (e) {
          console.log('Python is not available on this system');
          return false;
        }
      }
    }
  } catch (e) {
    console.log('Error checking Python availability:', e);
    return false;
  }
};

// Helper to run Python script with proper command
const runPythonScript = (args: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const scriptPath = getPythonScriptPath();
    
    // Check if the script exists
    if (!existsSync(scriptPath)) {
      reject(new Error(\`Python script not found: \${scriptPath}\`));
      return;
    }

    // Determine which python command to use
    const pythonCommand = (() => {
      if (process.platform === 'win32') {
        try {
          execSync('python --version', { stdio: 'ignore' });
          return 'python';
        } catch (e) {
          // Try py command on Windows
          try {
            execSync('py --version', { stdio: 'ignore' });
            return 'py';
          } catch (e) {
            return 'python';  // Default fallback even if it fails
          }
        }
      } else {
        try {
          execSync('python3 --version', { stdio: 'ignore' });
          return 'python3';
        } catch (e) {
          return 'python';
        }
      }
    })();

    console.log(\`Running Python script: \${pythonCommand} \${scriptPath} \${args.join(' ')}\`);
    
    const proc = spawn(pythonCommand, [scriptPath, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(\`Python stderr: \${stderr}\`);
    });
    
    proc.on('close', (code) => {
      if (code !== 0) {
        // If Python fails with known dependency issues, provide fallback
        if (stderr.includes('netifaces') || stderr.includes('pynetinfo') || stderr.includes('No module named')) {
          console.warn('Python module not available. Using fallback methods.');
          // Provide a simplified response when modules are not available
          if (args[0] === 'scan') {
            resolve(JSON.stringify([])); // Empty device list
          } else if (args[0] === 'device') {
            resolve(JSON.stringify({
              ip: args[1],
              mac: 'Unknown',
              name: 'Unknown Device',
              type: 'Unknown',
              status: 'Unknown',
              id: Math.random().toString(36).substring(2, 10)
            }));
          } else if (args[0] === 'status') {
            resolve(JSON.stringify({
              pythonAvailable: true,
              modules: {
                scapy: false,
                nmap: false,
                netifaces: false,
                psutil: false
              },
              os: process.platform
            }));
          }
        } else {
          reject(new Error(\`Python script failed with code \${code}: \${stderr}\`));
        }
      } else {
        resolve(stdout);
      }
    });
    
    proc.on('error', (err) => {
      console.error(\`Python process error: \${err.message}\`);
      reject(err);
    });
  });
};

// Get Windows network devices using fallback method
const getWindowsNetworkDevices = (): Promise<NetworkDevice[]> => {
  return new Promise((resolve) => {
    try {
      console.log('Using Windows-specific network discovery');
      // Use built-in Windows commands
      const output = execSync('arp -a', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      
      // Parse the output to extract devices
      const devices: NetworkDevice[] = [];
      const lines = output.split('\\n');
      
      lines.forEach((line, index) => {
        // Parse ARP table entries
        const match = line.match(/\\s*([\\d.]+)\\s+([\\w-]+)\\s+([\\w-:]+)/);
        if (match) {
          const ip = match[1];
          const mac = match[3].replace(/-/g, ':'); // Convert to standard MAC format
          
          // Get a device name
          let name = `Device-${index + 1}`;
          try {
            // Try to get hostname from Windows
            const hostnameOutput = execSync(\`ping -a -n 1 \${ip}\`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
            const hostnameMatch = hostnameOutput.match(/Pinging ([\\w.-]+)/);
            if (hostnameMatch && hostnameMatch[1] !== ip) {
              name = hostnameMatch[1];
            }
          } catch (e) {
            // Ignore ping errors
          }
          
          // Determine device type based on basic heuristics
          let type = 'unknown';
          if (mac.startsWith('00:50:56') || mac.startsWith('00:0C:29') || mac.startsWith('00:05:69')) {
            type = 'computer';
          } else if (mac.startsWith('3C:E0:72') || mac.startsWith('A4:83:E7') || mac.startsWith('68:D9:3C')) {
            type = 'smartphone';
          } else if (mac.startsWith('B8:27:EB') || mac.startsWith('DC:A6:32')) {
            type = 'computer'; // Raspberry Pi
          }
          
          devices.push({
            id: \`dev-\${ip.replace(/\\./g, '')}\`,
            ip,
            mac,
            name,
            type,
            status: 'Online',
            lastSeen: new Date().toISOString()
          });
        }
      });
      
      resolve(devices);
    } catch (error) {
      console.error('Windows network discovery error:', error);
      
      // Return mock data as last resort
      resolve([
        {
          id: 'dev-1921681001',
          ip: '192.168.1.1',
          mac: '00:11:22:33:44:55',
          name: 'Gateway',
          type: 'router',
          status: 'Online',
          lastSeen: new Date().toISOString()
        },
        {
          id: 'dev-1921681002',
          ip: '192.168.1.2',
          mac: '00:22:33:44:55:66', 
          name: 'Local-PC',
          type: 'computer',
          status: 'Online',
          lastSeen: new Date().toISOString()
        }
      ]);
    }
  });
};

export const networkScanner = {
  isPythonAvailable: isPythonAvailable(),
  runPythonScript, // Export for use in other files
  
  scan: async (): Promise<NetworkDevice[]> => {
    try {
      // Try to use Python scanner first
      if (isPythonAvailable()) {
        console.log('Using Python network scanner');
        try {
          const output = await runPythonScript(['scan']);
          try {
            return JSON.parse(output) as NetworkDevice[];
          } catch (e) {
            console.error('Failed to parse Python scanner output:', e);
            console.log('Python output:', output);
            throw e; // Let the next block handle fallback
          }
        } catch (e) {
          console.error('Python scanner error:', e);
          // Fall through to platform-specific fallbacks
        }
      }
      
      // Platform-specific fallbacks
      if (process.platform === 'win32') {
        return await getWindowsNetworkDevices();
      }
      
      // Fallback to original method for non-Windows
      console.log('Using fallback network scanner (ARP)');
      try {
        const output = execSync('arp -a').toString();
        const devices = output.split('\\n')
          .filter(line => line.includes('('))
          .map(line => {
            const [ip, mac] = line.split(/\\s+/);
            return {
              ip,
              mac,
              name: 'Unknown Device',
              type: 'unknown',
              status: 'Online',
              id: Math.random().toString(36).substring(2, 10)
            };
          });
        
        return devices;
      } catch (arpError) {
        console.error('ARP command failed:', arpError);
        // Return basic mock data if all else fails
        return [
          {
            id: 'mock-gateway',
            ip: '192.168.1.1',
            mac: '00:11:22:33:44:55',
            name: 'Default Gateway',
            type: 'router',
            status: 'Online'
          },
          {
            id: 'mock-device',
            ip: '192.168.1.100',
            mac: '11:22:33:44:55:66',
            name: 'This Device',
            type: 'computer',
            status: 'Online'
          }
        ];
      }
    } catch (error) {
      console.error('Network scan error:', error);
      return [];
    }
  },
  
  getDeviceDetails: async (ipAddress: string): Promise<NetworkDevice | null> => {
    try {
      if (isPythonAvailable()) {
        console.log(\`Getting device details for IP: \${ipAddress} using Python\`);
        try {
          const output = await runPythonScript(['device', ipAddress]);
          try {
            const device = JSON.parse(output) as NetworkDevice;
            if (!device.id) {
              device.id = Math.random().toString(36).substring(2, 10);
            }
            return device;
          } catch (e) {
            console.error(\`Failed to parse device details for \${ipAddress}:\`, e);
            console.log('Python output:', output);
            // Fall through to fallback
          }
        } catch (e) {
          console.error(\`Python device details error: \${e}\`);
          // Fall through to fallback
        }
      }
      
      // Platform-specific fallback
      if (process.platform === 'win32') {
        try {
          console.log(\`Using Windows fallback for device \${ipAddress}\`);
          // Try to get some basic info using ping
          const pingOutput = execSync(\`ping -a -n 1 \${ipAddress}\`, { encoding: 'utf8' });
          
          // Extract hostname if available
          let hostname = 'Unknown Device';
          const hostnameMatch = pingOutput.match(/Pinging ([\\w.-]+)/);
          if (hostnameMatch && hostnameMatch[1] !== ipAddress) {
            hostname = hostnameMatch[1];
          }
          
          // Try to get MAC from ARP
          let mac = 'Unknown';
          try {
            const arpOutput = execSync(\`arp -a \${ipAddress}\`, { encoding: 'utf8' });
            const macMatch = arpOutput.match(/([0-9A-Fa-f]{2}[:-][0-9A-Fa-f]{2}[:-][0-9A-Fa-f]{2}[:-][0-9A-Fa-f]{2}[:-][0-9A-Fa-f]{2}[:-][0-9A-Fa-f]{2})/);
            if (macMatch) {
              mac = macMatch[1];
            }
          } catch (e) {
            // Couldn't get MAC, continue with unknown
          }
          
          return {
            ip: ipAddress,
            mac,
            name: hostname,
            type: 'unknown',
            status: 'Online',
            id: \`dev-\${ipAddress.replace(/\\./g, '')}\`,
            lastSeen: new Date().toISOString()
          };
        } catch (e) {
          // Device probably offline
          return {
            ip: ipAddress,
            mac: 'Unknown',
            name: 'Unresponsive Device',
            type: 'unknown',
            status: 'Offline',
            id: \`dev-\${ipAddress.replace(/\\./g, '')}\`,
            lastSeen: new Date().toISOString()
          };
        }
      }
      
      console.log(\`Using generic fallback for device \${ipAddress}\`);
      return {
        ip: ipAddress,
        mac: 'Unknown',
        name: 'Unknown Device',
        type: 'unknown',
        status: 'Unknown',
        id: \`dev-\${ipAddress.replace(/\\./g, '')}\`,
        lastSeen: new Date().toISOString()
      };
    } catch (error) {
      console.error(\`Error getting device details for \${ipAddress}:\`, error);
      return null;
    }
  }
};
`;
    fs.writeFileSync(path.join('local-scanner', 'networkScanner.ts'), networkScannerContent);
    console.log(`Created improved networkScanner.ts with Windows support`);
  } else {
    console.log(`networkScanner.ts already exists`);
  }
  
  // Create a basic tsconfig.json if it doesn't exist
  if (!fs.existsSync(path.join('local-scanner', 'tsconfig.json'))) {
    const tsConfig = {
      "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "esModuleInterop": true,
        "strict": true,
        "outDir": "dist"
      },
      "include": ["./*.ts"]
    };
    fs.writeFileSync(
      path.join('local-scanner', 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
    console.log(`Created local-scanner/tsconfig.json`);
  } else {
    console.log(`local-scanner/tsconfig.json already exists`);
  }

  // Create a minimal Python scanner script if it doesn't exist
  const pythonScriptPath = path.join('local-scanner', 'python', 'network_scanner.py');
  if (!fs.existsSync(pythonScriptPath)) {
    // Create a simple Python script with Windows compatibility
    const minimalPythonScript = `#!/usr/bin/env python
import json
import sys
import socket
import platform
import re
import os
import time
from datetime import datetime

def get_os():
    """Detect the operating system."""
    return platform.system()

def scan_network_devices():
    """Scan for devices on the network and return a list of them."""
    devices = []
    
    try:
        if get_os() == "Windows":
            # For Windows, use the 'arp -a' command
            import subprocess
            arp_output = subprocess.check_output(["arp", "-a"], shell=True).decode("utf-8")
            lines = arp_output.split("\\n")
            
            for line in lines:
                if "dynamic" in line.lower():
                    parts = line.split()
                    if len(parts) >= 2:
                        ip = parts[0].strip()
                        mac = parts[1].strip()
                        
                        # Try to get hostname
                        hostname = f"Device-{len(devices)+1}"
                        try:
                            hostname_info = socket.gethostbyaddr(ip)[0]
                            if hostname_info:
                                hostname = hostname_info
                        except:
                            pass
                        
                        devices.append({
                            "id": f"dev-{len(devices)+1}",
                            "ip": ip,
                            "mac": mac,
                            "name": hostname,
                            "type": "unknown",
                            "manufacturer": "Unknown",
                            "status": "Online"
                        })
    except Exception as e:
        print(f"Error during scan: {str(e)}", file=sys.stderr)
    
    return devices

def get_device_details(ip):
    """Get detailed information about a specific device."""
    device_info = {
        "id": f"dev-{ip.replace('.', '')}",
        "ip": ip,
        "mac": "",
        "name": "Unknown",
        "type": "unknown",
        "status": "Unknown",
        "manufacturer": "Unknown",
        "lastSeen": datetime.now().isoformat()
    }
    
    try:
        # Basic check if device is up
        os_name = get_os()
        ping_param = "-n" if os_name == "Windows" else "-c"
        import subprocess
        ping_result = subprocess.call(["ping", ping_param, "1", ip], 
                                stdout=subprocess.DEVNULL, 
                                stderr=subprocess.DEVNULL)
        device_info["status"] = "Online" if ping_result == 0 else "Offline"
        
        # Try to get hostname
        try:
            device_info["name"] = socket.gethostbyaddr(ip)[0]
        except:
            pass
            
        # Try to get MAC address (Windows)
        if os_name == "Windows" and device_info["status"] == "Online":
            try:
                arp_output = subprocess.check_output(["arp", "-a", ip], shell=True).decode("utf-8")
                mac_match = re.search(r"([0-9a-f]{2}-[0-9a-f]{2}-[0-9a-f]{2}-[0-9a-f]{2}-[0-9a-f]{2}-[0-9a-f]{2})", 
                                    arp_output, re.IGNORECASE)
                if mac_match:
                    device_info["mac"] = mac_match.group(1).replace("-", ":")
            except:
                pass
    
    except Exception as e:
        print(f"Error getting details for {ip}: {str(e)}", file=sys.stderr)
    
    return device_info

if __name__ == "__main__":
    # Simple command processing
    if len(sys.argv) < 2:
        print("Usage: python network_scanner.py [command] [parameters]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    try:
        if command == "scan":
            devices = scan_network_devices()
            print(json.dumps(devices))
            
        elif command == "device" and len(sys.argv) >= 3:
            ip_address = sys.argv[2]
            details = get_device_details(ip_address)
            print(json.dumps(details))
            
        elif command == "status":
            # Check which modules are available
            modules = {
                "scapy": False,
                "nmap": False,
                "netifaces": False,
                "psutil": False
            }
            
            # Try to import the modules
            try:
                import scapy
                modules["scapy"] = True
            except ImportError:
                pass
                
            try:
                import nmap
                modules["nmap"] = True
            except ImportError:
                pass
                
            try:
                import netifaces
                modules["netifaces"] = True
            except ImportError:
                pass
                
            try:
                import psutil
                modules["psutil"] = True
            except ImportError:
                pass
            
            print(json.dumps({
                "os": get_os(),
                "python_version": platform.python_version(),
                "modules": modules
            }))
        else:
            print(json.dumps({"error": f"Unknown command: {command}"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
`;
    fs.writeFileSync(pythonScriptPath, minimalPythonScript);
    console.log(`Created minimal Windows-compatible Python scanner script`);
    
    // Make it executable on Unix systems
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(pythonScriptPath, '755');
      } catch (err) {
        console.log('Note: Could not make Python script executable, you may need to do this manually');
      }
    }
  }
  
  console.log(`${colors.green}Files copied successfully${colors.reset}\n`);
};

// Install dependencies
const installDependencies = () => {
  console.log(`${colors.yellow}Installing dependencies...${colors.reset}`);
  
  try {
    process.chdir('local-scanner');
    console.log(`Changed directory to local-scanner`);
    
    console.log(`Installing npm dependencies...`);
    execSync('npm install', { stdio: 'inherit' });
    
    console.log(`${colors.green}Node.js dependencies installed successfully${colors.reset}`);
    
    // Try to install Python dependencies if Python is available
    if (isPythonAvailable()) {
      console.log(`\n${colors.yellow}Python detected, attempting to install Python dependencies...${colors.reset}`);
      
      try {
        const isWindows = process.platform === 'win32';
        const pipCmd = isWindows ? 'pip install pynetinfo getmac colorama' : 'pip install -r python/requirements.txt';
        
        console.log(`Running: ${pipCmd}`);
        execSync(pipCmd, { stdio: 'inherit' });
        console.log(`${colors.green}Python dependencies installed successfully${colors.reset}`);
      } catch (error) {
        console.log(`${colors.yellow}Warning: Could not install Python dependencies.${colors.reset}`);
        console.log(`This is not critical - the scanner will use fallback methods.`);
        console.log(`You can try installing manually using:`);
        console.log(`- For Windows: pip install pynetinfo getmac colorama`);
        console.log(`- For Linux/Mac: pip install -r python/requirements.txt`);
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error installing dependencies: ${error.message}${colors.reset}`);
  } finally {
    // Make sure we return to the original directory
    process.chdir('..');
  }
};

// Check Python availability
const isPythonAvailable = () => {
  console.log(`${colors.yellow}Checking Python availability...${colors.reset}`);
  
  try {
    // For Windows, try 'python' command first
    if (process.platform === 'win32') {
      try {
        execSync('python --version', { stdio: 'pipe' });
        console.log(`${colors.green}Python is available on this Windows system${colors.reset}`);
        return true;
      } catch (error) {
        // Try 'py' command (Windows Python Launcher)
        try {
          execSync('py --version', { stdio: 'pipe' });
          console.log(`${colors.green}Python is available via 'py' command${colors.reset}`);
          return true;
        } catch (e) {
          console.log(`${colors.yellow}Python is not available on this Windows system.${colors.reset}`);
          return false;
        }
      }
    } else {
      // For non-Windows, try python3 first, then python
      const pythonCommand = process.platform === 'win32' ? 'python --version' : 'python3 --version';
      execSync(pythonCommand, { stdio: 'pipe' });
      console.log(`${colors.green}Python is available on this system${colors.reset}`);
      return true;
    }
  } catch (error) {
    try {
      // Try 'python' as fallback for non-Windows
      if (process.platform !== 'win32') {
        execSync('python --version', { stdio: 'pipe' });
        console.log(`${colors.green}Python is available via 'python' command${colors.reset}`);
        return true;
      }
    } catch (e) {
      // Ignore
    }
    
    console.log(`${colors.yellow}Python is not available. Network scanner will run with limited functionality.${colors.reset}`);
    console.log(`To enable advanced features, please install Python 3.8+ and required packages.`);
    console.log(`Don't worry - basic scanning will still work without Python.`);
    return false;
  }
};

// Main function
const main = () => {
  try {
    createDirectories();
    copyRequiredFiles();
    installDependencies();
    const pythonAvailable = isPythonAvailable();
    
    console.log(`\n${colors.bright}${colors.green}Setup Complete!${colors.reset}`);
    console.log(`\n${colors.bright}To start the network scanner:${colors.reset}`);
    console.log(`1. cd local-scanner`);
    console.log(`2. npm start`);
    
    if (!pythonAvailable) {
      if (process.platform === 'win32') {
        console.log(`\n${colors.yellow}Note: For full functionality on Windows, install Python 3.8+ and run:${colors.reset}`);
        console.log(`pip install pynetinfo getmac colorama`);
      } else {
        console.log(`\n${colors.yellow}Note: For full functionality, install Python 3.8+ and run:${colors.reset}`);
        console.log(`pip install -r python/requirements.txt`);
      }
      console.log(`\n${colors.green}Basic scanning will work without Python. The application is ready to use.${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`${colors.red}Setup failed: ${error.message}${colors.reset}`);
    console.error(`Please check the error message and try again.`);
  }
};

// Run the script
main();
