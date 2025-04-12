
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

    const proc = spawn(pythonCommand, [scriptPath, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
};

export const networkScanner = {
  scan: async (): Promise<NetworkDevice[]> => {
    try {
      // Try to use Python scanner first
      if (isPythonAvailable()) {
        console.log('Using Python network scanner');
        const output = await runPythonScript(['scan']);
        return JSON.parse(output) as NetworkDevice[];
      } 
      
      // Fallback to original method
      console.log('Using fallback network scanner (ARP)');
      const output = execSync('arp -a').toString();
      const devices = output.split('\n')
        .filter(line => line.includes('('))
        .map(line => {
          const [ip, mac] = line.split(/\s+/);
          return {
            ip,
            mac,
            name: 'Unknown Device',
            type: 'Unknown'
          };
        });
      
      return devices;
    } catch (error) {
      console.error('Network scan error:', error);
      return [];
    }
  },
  
  getDeviceDetails: async (ipAddress: string): Promise<NetworkDevice | null> => {
    try {
      if (isPythonAvailable()) {
        const output = await runPythonScript(['device', ipAddress]);
        return JSON.parse(output) as NetworkDevice;
      }
      return null;
    } catch (error) {
      console.error(`Error getting device details for ${ipAddress}:`, error);
      return null;
    }
  }
};
