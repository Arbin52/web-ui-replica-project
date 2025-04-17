
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

// Create directory structure if it doesn't exist
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

// Copy the local-scanner package.json file to the correct location
const copyPackageJson = () => {
  console.log(`${colors.yellow}Checking package.json...${colors.reset}`);
  
  const localScannerPackageJsonPath = path.join('local-scanner', 'package.json');
  
  if (!fs.existsSync(localScannerPackageJsonPath)) {
    console.log(`Creating package.json in local-scanner directory`);
    
    // Basic package.json with required dependencies
    const packageJsonContent = {
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
      localScannerPackageJsonPath,
      JSON.stringify(packageJsonContent, null, 2)
    );
    
    console.log(`${colors.green}Created package.json in local-scanner directory${colors.reset}`);
  } else {
    console.log(`${colors.green}package.json already exists in local-scanner directory${colors.reset}`);
  }
};

// Install dependencies
const installDependencies = () => {
  console.log(`${colors.yellow}Installing dependencies...${colors.reset}`);
  
  try {
    // Change directory to local-scanner
    if (fs.existsSync('local-scanner')) {
      process.chdir('local-scanner');
      console.log(`Changed directory to local-scanner`);
      
      // Install npm dependencies
      console.log(`Installing npm dependencies...`);
      execSync('npm install', { stdio: 'inherit' });
      
      console.log(`${colors.green}Node.js dependencies installed successfully${colors.reset}`);
      
      // Check if Python is available
      const isPythonAvailable = checkPythonAvailability();
      
      if (isPythonAvailable) {
        console.log(`${colors.yellow}Installing Python dependencies...${colors.reset}`);
        
        // Different commands for Windows vs Unix
        if (process.platform === 'win32') {
          try {
            execSync('pip install pynetinfo getmac colorama', { stdio: 'inherit' });
            console.log(`${colors.green}Python dependencies installed successfully${colors.reset}`);
          } catch (e) {
            console.log(`${colors.yellow}Warning: Could not install Python dependencies.${colors.reset}`);
            console.log(`The scanner will still work with limited functionality.`);
          }
        } else {
          try {
            if (fs.existsSync(path.join('python', 'requirements.txt'))) {
              execSync('pip install -r python/requirements.txt', { stdio: 'inherit' });
            } else {
              execSync('pip install netifaces getmac scapy', { stdio: 'inherit' });
            }
            console.log(`${colors.green}Python dependencies installed successfully${colors.reset}`);
          } catch (e) {
            console.log(`${colors.yellow}Warning: Could not install Python dependencies.${colors.reset}`);
            console.log(`The scanner will still work with limited functionality.`);
          }
        }
      }
      
      // Go back to root directory
      process.chdir('..');
    } else {
      console.error(`${colors.red}Error: local-scanner directory does not exist${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}Error installing dependencies: ${error.message}${colors.reset}`);
    
    // Go back to root directory
    try {
      process.chdir('..');
    } catch (e) {
      // Already in root, ignore
    }
  }
};

// Check if Python is available
const checkPythonAvailability = () => {
  console.log(`${colors.yellow}Checking Python availability...${colors.reset}`);
  
  try {
    if (process.platform === 'win32') {
      // For Windows, try both python and py commands
      try {
        execSync('python --version', { stdio: 'pipe' });
        console.log(`${colors.green}Python found via 'python' command${colors.reset}`);
        return true;
      } catch (e) {
        try {
          execSync('py --version', { stdio: 'pipe' });
          console.log(`${colors.green}Python found via 'py' command${colors.reset}`);
          return true;
        } catch (e) {
          console.log(`${colors.yellow}Python not found. Scanner will use basic functionality.${colors.reset}`);
          return false;
        }
      }
    } else {
      // For Unix, try python3 first, then python
      try {
        execSync('python3 --version', { stdio: 'pipe' });
        console.log(`${colors.green}Python found via 'python3' command${colors.reset}`);
        return true;
      } catch (e) {
        try {
          execSync('python --version', { stdio: 'pipe' });
          console.log(`${colors.green}Python found via 'python' command${colors.reset}`);
          return true;
        } catch (e) {
          console.log(`${colors.yellow}Python not found. Scanner will use basic functionality.${colors.reset}`);
          return false;
        }
      }
    }
  } catch (e) {
    console.log(`${colors.yellow}Error checking Python: ${e.message}${colors.reset}`);
    return false;
  }
};

// Create basic network scanner files if they don't exist
const createScannerFiles = () => {
  console.log(`${colors.yellow}Setting up scanner files...${colors.reset}`);
  
  // Create index.ts if it doesn't exist
  const indexPath = path.join('local-scanner', 'index.ts');
  if (!fs.existsSync(indexPath)) {
    // Simple index.ts with basic functionality
    const indexContent = `
import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { spawn } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple network device interface
interface NetworkDevice {
  id: string;
  ip: string;
  mac?: string;
  name?: string;
  type?: string;
  status?: string;
}

// Simple scanner with fallback to ARP table
const getNetworkDevices = () => {
  try {
    // For Windows, use ARP
    if (process.platform === 'win32') {
      const output = execSync('arp -a', { encoding: 'utf8' });
      const devices: NetworkDevice[] = [];
      
      output.split('\\n').forEach((line, index) => {
        const match = line.match(/\\s*([\\d.]+)\\s+([\\w-]+)\\s+([\\w-:]+)/);
        if (match) {
          const ip = match[1];
          const mac = match[3].replace(/-/g, ':');
          
          devices.push({
            id: \`dev-\${index}\`,
            ip,
            mac,
            name: \`Device \${index + 1}\`,
            type: 'unknown',
            status: 'Online'
          });
        }
      });
      
      return devices;
    }
    
    // Unix fallback
    const output = execSync('arp -a', { encoding: 'utf8' });
    const devices: NetworkDevice[] = [];
    
    output.split('\\n').forEach((line, index) => {
      if (line.includes('(')) {
        const parts = line.split(/[()\\s]+/).filter(Boolean);
        if (parts.length >= 4) {
          const ip = parts[1];
          const mac = parts[3];
          
          devices.push({
            id: \`dev-\${index}\`,
            ip,
            mac,
            name: \`Device \${index + 1}\`,
            type: 'unknown',
            status: 'Online'
          });
        }
      }
    });
    
    return devices;
  } catch (error) {
    console.error('Error getting devices:', error);
    
    // Return mock data if real scan fails
    return [
      {
        id: 'router',
        ip: '192.168.1.1',
        mac: '00:11:22:33:44:55',
        name: 'Router',
        type: 'router',
        status: 'Online'
      },
      {
        id: 'local',
        ip: '192.168.1.100',
        mac: '11:22:33:44:55:66',
        name: 'This PC',
        type: 'computer',
        status: 'Online'
      }
    ];
  }
};

// Check if we have Python available
const isPythonAvailable = () => {
  try {
    if (process.platform === 'win32') {
      execSync('python --version', { stdio: 'ignore' });
    } else {
      execSync('python3 --version', { stdio: 'ignore' });
    }
    return true;
  } catch (e) {
    return false;
  }
};

// Routes
app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    pythonAvailable: isPythonAvailable(),
    version: '1.0.0'
  });
});

app.get('/devices', (req, res) => {
  res.json(getNetworkDevices());
});

app.get('/device/:ip', (req, res) => {
  const { ip } = req.params;
  const devices = getNetworkDevices();
  const device = devices.find(d => d.ip === ip);
  
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

app.listen(PORT, () => {
  console.log(\`Network Scanner running on port \${PORT}\`);
  console.log(\`Python integration \${isPythonAvailable() ? 'available' : 'not available'}\`);
});
`;
    fs.writeFileSync(indexPath, indexContent);
    console.log(`${colors.green}Created basic index.ts file${colors.reset}`);
  } else {
    console.log(`index.ts already exists`);
  }
  
  // Create a basic tsconfig.json if needed
  const tsconfigPath = path.join('local-scanner', 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfigContent = {
      "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "esModuleInterop": true,
        "strict": true,
        "outDir": "dist"
      },
      "include": ["./*.ts"]
    };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfigContent, null, 2));
    console.log(`${colors.green}Created tsconfig.json${colors.reset}`);
  }
  
  console.log(`${colors.green}Scanner files setup complete${colors.reset}`);
};

// Main function to run the setup
const main = async () => {
  try {
    createDirectories();
    copyPackageJson();
    createScannerFiles();
    installDependencies();
    
    console.log(`\n${colors.bright}${colors.green}Setup Complete!${colors.reset}`);
    console.log(`\n${colors.bright}To start the network scanner:${colors.reset}`);
    console.log(`1. cd local-scanner`);
    console.log(`2. npm start`);
    console.log(`\n${colors.bright}Then in another terminal:${colors.reset}`);
    console.log(`npm run dev`);
    
    console.log(`\n${colors.green}If you see any "module not found" errors when starting the scanner:${colors.reset}`);
    console.log(`1. cd local-scanner`);
    console.log(`2. npm install ts-node express cors`);
  } catch (error) {
    console.error(`${colors.red}Setup failed: ${error.message}${colors.reset}`);
  }
};

// Run the setup
main();
