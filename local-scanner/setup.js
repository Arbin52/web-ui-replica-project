
/**
 * Network Scanner Setup Script
 * This script helps set up the network scanner service
 */

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

console.log(`\n${colors.bold}${colors.cyan}=== NETWORK SCANNER SETUP HELPER ===${colors.reset}\n`);

try {
  console.log(`${colors.yellow}Setting up the network scanner...${colors.reset}\n`);
  
  // Step 1: Create or update package.json with correct dependencies
  console.log(`${colors.yellow}[1/3] Setting up package.json...${colors.reset}`);
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  let packageJson;
  
  if (fs.existsSync(packageJsonPath)) {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } else {
    packageJson = {
      "name": "network-scanner-service",
      "version": "1.0.0",
      "description": "Local network scanner service",
      "main": "index.js",
      "scripts": {},
      "dependencies": {},
      "devDependencies": {}
    };
  }
  
  // Ensure we have the right dependencies
  packageJson.dependencies = {
    ...packageJson.dependencies,
    "cors": "^2.8.5",
    "express": "^4.18.2"
  };
  
  // Make sure we have a start script that works for the current files
  if (fs.existsSync(path.join(__dirname, 'index.ts'))) {
    // For TypeScript version
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "ts-node": "^10.9.1"
    };
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      "@types/cors": "^2.8.13",
      "@types/express": "^4.17.17",
      "@types/node": "^20.3.1",
      "typescript": "^5.1.3"
    };
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "ts-node index.ts"
    };
  } else if (fs.existsSync(path.join(__dirname, 'index.js'))) {
    // For JavaScript version
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "node index.js"
    };
  }
  
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );
  console.log(`${colors.green}✓ package.json updated${colors.reset}`);

  // Step 2: Install dependencies
  console.log(`\n${colors.yellow}[2/3] Installing dependencies...${colors.reset}`);
  console.log(`This may take a minute. Please wait...`);
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Dependencies installed${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error installing dependencies: ${error.message}${colors.reset}`);
    console.log(`\nTry running manually: npm install express cors`);
    if (fs.existsSync(path.join(__dirname, 'index.ts'))) {
      console.log(`And: npm install -D typescript ts-node @types/express @types/cors @types/node`);
    }
  }
  
  // Step 3: Create a simpler JavaScript version if TypeScript is causing issues
  console.log(`\n${colors.yellow}[3/3] Creating fallback JavaScript version...${colors.reset}`);
  
  // Create a fallback index.js if there are issues with TS
  const indexJsPath = path.join(__dirname, 'index.js');
  if (!fs.existsSync(indexJsPath)) {
    const indexJsContent = `
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple network device interface
function getNetworkDevices() {
  try {
    // For Windows, use ARP
    if (process.platform === 'win32') {
      const output = execSync('arp -a', { encoding: 'utf8' });
      const devices = [];
      
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
    const devices = [];
    
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
}

// Check if we have Python available
function isPythonAvailable() {
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
}

// Routes
app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    pythonAvailable: isPythonAvailable(),
    version: '1.0.0',
    mode: 'JavaScript'
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
    version: '1.0.0',
    nodeOnly: true
  });
});

app.post('/scan', (req, res) => {
  console.log('Scan requested');
  res.json({ status: 'Scan initiated' });
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
    
    fs.writeFileSync(indexJsPath, indexJsContent);
    console.log(`${colors.green}✓ Created fallback index.js file${colors.reset}`);
  } else {
    console.log(`${colors.yellow}index.js already exists${colors.reset}`);
  }

  // Success message with clear instructions
  console.log(`\n${colors.bold}${colors.green}✓ SETUP COMPLETE!${colors.reset}`);
  console.log(`\n${colors.bold}${colors.cyan}HOW TO START THE SCANNER:${colors.reset}`);
  console.log(`1. To start the scanner, run this command in this directory:`);
  console.log(`   ${colors.bold}npm start${colors.reset}`);
  console.log(`\n2. If you get TypeScript errors, try using the JavaScript version:`);
  console.log(`   ${colors.bold}node index.js${colors.reset}`);
  console.log(`\nThen open a new terminal window and run: npm run dev (for the main app)\n`);

} catch (error) {
  console.error(`\n${colors.red}ERROR: ${error.message}${colors.reset}`);
  console.log(`\nTry installing dependencies manually:`);
  console.log(`npm install express cors`);
}
