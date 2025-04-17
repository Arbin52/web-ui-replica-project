
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m"
};

console.log(`\n${colors.bold}${colors.cyan}=== SIMPLE NETWORK SCANNER SETUP ===${colors.reset}\n`);

try {
  // Step 1: Create directory structure
  console.log(`${colors.yellow}[1/4] Setting up directories...${colors.reset}`);
  if (!fs.existsSync('python')) {
    fs.mkdirSync('python', { recursive: true });
  }
  console.log(`${colors.green}✓ Directories ready${colors.reset}`);

  // Step 2: Create or update package.json
  console.log(`\n${colors.yellow}[2/4] Setting up package.json...${colors.reset}`);
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  const packageJson = {
    "name": "network-scanner-service",
    "version": "1.0.0",
    "description": "Local network scanner service",
    "main": "index.ts",
    "scripts": {
      "start": "ts-node index.ts",
      "dev": "ts-node-dev --respawn index.ts"
    },
    "dependencies": {
      "cors": "^2.8.5",
      "express": "^4.18.2",
      "ts-node": "^10.9.1"
    },
    "devDependencies": {
      "@types/cors": "^2.8.13",
      "@types/express": "^4.17.17",
      "@types/node": "^20.3.1",
      "ts-node-dev": "^2.0.0",
      "typescript": "^5.1.3"
    }
  };
  
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );
  console.log(`${colors.green}✓ package.json created${colors.reset}`);

  // Step 3: Install dependencies
  console.log(`\n${colors.yellow}[3/4] Installing dependencies...${colors.reset}`);
  console.log(`This may take a minute. Please wait...`);
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Dependencies installed${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error installing dependencies: ${error.message}${colors.reset}`);
    console.log(`\nTry running manually: npm install ts-node express cors`);
  }

  // Step 4: Create basic index.ts file if it doesn't exist
  console.log(`\n${colors.yellow}[4/4] Setting up scanner files...${colors.reset}`);
  const indexPath = path.join(__dirname, 'index.ts');
  
  if (!fs.existsSync(indexPath)) {
    const indexContent = `
import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';

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

app.get('/scanner-status', (req, res) => {
  res.json({
    pythonAvailable: isPythonAvailable(),
    os: process.platform,
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(\`\\n==============================\`);
  console.log(\`Network Scanner running on port \${PORT}\`);
  console.log(\`==============================\`);
  console.log(\`Visit http://localhost:\${PORT}/status in your browser\`);
  console.log(\`Python integration: \${isPythonAvailable() ? 'available ✓' : 'not available ✗'}\`);
  console.log(\`\\nKeep this window open and open a new terminal to run the main app.\`);
});
`;
    fs.writeFileSync(indexPath, indexContent);
    console.log(`${colors.green}✓ index.ts created${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ index.ts already exists${colors.reset}`);
  }

  // Create a basic tsconfig.json if needed
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
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
    console.log(`${colors.green}✓ tsconfig.json created${colors.reset}`);
  }

  // Success message with clear instructions
  console.log(`\n${colors.bold}${colors.green}✓ SETUP COMPLETE!${colors.reset}`);
  console.log(`\n${colors.bold}${colors.cyan}HOW TO START THE SCANNER:${colors.reset}`);
  console.log(`${colors.bold}Just run:${colors.reset} npm start`);
  console.log(`Then open a new terminal window and run: npm run dev\n`);

  // Quick fix for common issues
  console.log(`${colors.yellow}If you get "module not found" errors:${colors.reset}`);
  console.log(`Run: npm install ts-node express cors\n`);

} catch (error) {
  console.error(`\n${colors.red}ERROR: ${error.message}${colors.reset}`);
  console.log(`\nTry installing dependencies manually:`);
  console.log(`npm install ts-node express cors`);
}
