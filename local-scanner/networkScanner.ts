
import { execSync } from 'child_process';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { NetworkDevice } from '../src/hooks/network/types';

// Helper to determine the correct path to the Python script
const getPythonScriptPath = () => {
  const relativePath = 'python/network_scanner.py';
  const scriptPath = path.join(__dirname, relativePath);
  return scriptPath;
};

// Helper to check if Python is available
const isPythonAvailable = (): boolean => {
  try {
    // Check for Python 3 first
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
};

// Helper to run Python script with proper command
const runPythonScript = (args: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const scriptPath = getPythonScriptPath();
    
    // Check if the script exists
    if (!existsSync(scriptPath)) {
      reject(new Error(`Python script not found: ${scriptPath}`));
      return;
    }

    // Determine which python command to use
    const pythonCommand = (() => {
      try {
        execSync('python3 --version', { stdio: 'ignore' });
        return 'python3';
      } catch (e) {
        return 'python';
      }
    })();

    console.log(`Running Python script: ${pythonCommand} ${scriptPath} ${args.join(' ')}`);
    
    const proc = spawn(pythonCommand, [scriptPath, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(`Python stderr: ${stderr}`);
    });
    
    proc.on('close', (code) => {
      if (code !== 0) {
        if (stderr.includes('netifaces')) {
          console.warn('Python netifaces module not available. Using fallback methods.');
          // Provide a simplified response when netifaces is not available
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
          reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        }
      } else {
        resolve(stdout);
      }
    });
    
    proc.on('error', (err) => {
      console.error(`Python process error: ${err.message}`);
      reject(err);
    });
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
        const output = await runPythonScript(['scan']);
        try {
          return JSON.parse(output) as NetworkDevice[];
        } catch (e) {
          console.error('Failed to parse Python scanner output:', e);
          console.log('Python output:', output);
          throw e; // Let the next block handle fallback
        }
      } 
      
      // Fallback to original method
      console.log('Using fallback network scanner (ARP)');
      try {
        const output = execSync('arp -a').toString();
        const devices = output.split('\n')
          .filter(line => line.includes('('))
          .map(line => {
            const [ip, mac] = line.split(/\s+/);
            return {
              ip,
              mac,
              name: 'Unknown Device',
              type: 'Unknown',
              status: 'Online',
              id: Math.random().toString(36).substring(2, 10)
            };
          });
        
        return devices;
      } catch (arpError) {
        console.error('ARP command failed:', arpError);
        // Return empty array if both Python and ARP fail
        return [];
      }
    } catch (error) {
      console.error('Network scan error:', error);
      return [];
    }
  },
  
  getDeviceDetails: async (ipAddress: string): Promise<NetworkDevice | null> => {
    try {
      if (isPythonAvailable()) {
        console.log(`Getting device details for IP: ${ipAddress} using Python`);
        const output = await runPythonScript(['device', ipAddress]);
        try {
          const device = JSON.parse(output) as NetworkDevice;
          if (!device.id) {
            device.id = Math.random().toString(36).substring(2, 10);
          }
          return device;
        } catch (e) {
          console.error(`Failed to parse device details for ${ipAddress}:`, e);
          console.log('Python output:', output);
          return null;
        }
      }
      
      console.log(`Python unavailable, using fallback for device ${ipAddress}`);
      return {
        ip: ipAddress,
        mac: 'Unknown',
        name: 'Unknown Device',
        type: 'Unknown',
        status: 'Unknown',
        id: Math.random().toString(36).substring(2, 10)
      };
    } catch (error) {
      console.error(`Error getting device details for ${ipAddress}:`, error);
      return null;
    }
  }
};
