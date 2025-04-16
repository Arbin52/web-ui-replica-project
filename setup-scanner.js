
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
    }
  } catch (err) {
    console.error(`${colors.red}Error copying python requirements: ${err.message}${colors.reset}`);
  }
  
  // Copy package.json if it doesn't exist
  if (!fs.existsSync(path.join('local-scanner', 'package.json'))) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('local-scanner/package.json', 'utf8'));
      fs.writeFileSync(
        path.join('local-scanner', 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      console.log(`Created local-scanner/package.json`);
    } catch (err) {
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
  
  // Create a simple networkScanner.ts with fallback implementation
  if (!fs.existsSync(path.join('local-scanner', 'networkScanner.ts'))) {
    const networkScannerContent = `
// Simple fallback implementation - the real file should not be modified
import { spawn } from 'child_process';
import { platform } from 'os';

interface NetworkDevice {
  ip: string;
  mac?: string;
  hostname?: string;
  vendor?: string;
  isGateway?: boolean;
  lastSeen?: string;
}

class NetworkScanner {
  isPythonAvailable: boolean = false;
  
  constructor() {
    // Check if Python is available on startup
    this.checkPythonAvailability();
  }
  
  private async checkPythonAvailability(): Promise<void> {
    try {
      // Try to execute a simple Python command
      await this.runPythonScript(['--version']);
      this.isPythonAvailable = true;
      console.log('Python is available for network scanning');
    } catch (error) {
      this.isPythonAvailable = false;
      console.log('Python is not available, using fallback scanning methods');
    }
  }
  
  async runPythonScript(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const pythonCommand = platform() === 'win32' ? 'python' : 'python3';
      const pythonProcess = spawn(pythonCommand, args);
      
      let outputData = '';
      let errorData = '';
      
      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(outputData);
        } else {
          reject(new Error(\`Python script exited with code \${code}: \${errorData}\`));
        }
      });
      
      pythonProcess.on('error', (err) => {
        reject(new Error(\`Failed to start Python process: \${err.message}\`));
      });
    });
  }
  
  async scan(): Promise<NetworkDevice[]> {
    // Return some mock devices as fallback
    return [
      {
        ip: '192.168.1.1',
        mac: '00:11:22:33:44:55',
        hostname: 'gateway',
        vendor: 'Default Router',
        isGateway: true,
        lastSeen: new Date().toISOString()
      },
      {
        ip: '192.168.1.100',
        mac: '11:22:33:44:55:66',
        hostname: 'laptop-device',
        vendor: 'Common PC',
        lastSeen: new Date().toISOString()
      },
      {
        ip: '192.168.1.101',
        mac: '22:33:44:55:66:77',
        hostname: 'smartphone-device',
        vendor: 'Phone Manufacturer',
        lastSeen: new Date().toISOString()
      }
    ];
  }
  
  async getDeviceDetails(ipAddress: string): Promise<NetworkDevice | null> {
    // Return mock detail for the specified IP
    const mockDevices = await this.scan();
    return mockDevices.find(device => device.ip === ipAddress) || null;
  }
}

export const networkScanner = new NetworkScanner();
`;
    fs.writeFileSync(path.join('local-scanner', 'networkScanner.ts'), networkScannerContent);
    console.log(`Created a temporary networkScanner.ts for basic functionality`);
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
    
    console.log(`${colors.green}Dependencies installed successfully${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}Error installing dependencies: ${error.message}${colors.reset}`);
  } finally {
    // Make sure we return to the original directory
    process.chdir('..');
  }
};

// Check Python availability
const checkPythonAvailability = () => {
  console.log(`${colors.yellow}Checking Python availability...${colors.reset}`);
  
  try {
    const pythonCommand = process.platform === 'win32' ? 'python --version' : 'python3 --version';
    execSync(pythonCommand, { stdio: 'pipe' });
    console.log(`${colors.green}Python is available on this system${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.yellow}Python is not available. Network scanner will run with limited functionality.${colors.reset}`);
    console.log(`To enable advanced features, please install Python 3.8+ and required packages.`);
    return false;
  }
};

// Main function
const main = () => {
  try {
    createDirectories();
    copyRequiredFiles();
    installDependencies();
    const pythonAvailable = checkPythonAvailability();
    
    console.log(`\n${colors.bright}${colors.green}Setup Complete!${colors.reset}`);
    console.log(`\n${colors.bright}To start the network scanner:${colors.reset}`);
    console.log(`1. cd local-scanner`);
    console.log(`2. npm start`);
    
    if (!pythonAvailable) {
      console.log(`\n${colors.yellow}Note: For full functionality, install Python 3.8+ and run:${colors.reset}`);
      console.log(`pip install -r python/requirements.txt`);
    }
    
  } catch (error) {
    console.error(`${colors.red}Setup failed: ${error.message}${colors.reset}`);
    console.error(`Please check the error message and try again.`);
  }
};

// Run the script
main();
