
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

console.log(`\n${colors.bold}${colors.cyan}=== NODE.JS NETWORK SCANNER SETUP ===${colors.reset}\n`);

try {
  // Step 1: Create package.json
  console.log(`${colors.yellow}[1/3] Setting up package.json...${colors.reset}`);
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  const packageJson = {
    "name": "network-scanner-service",
    "version": "1.0.0",
    "description": "Local network scanner service (Node.js Only)",
    "main": "index.js",
    "scripts": {
      "start": "node index.js"
    },
    "dependencies": {
      "cors": "^2.8.5",
      "express": "^4.18.2"
    }
  };
  
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );
  console.log(`${colors.green}✓ package.json created${colors.reset}`);

  // Step 2: Install dependencies
  console.log(`\n${colors.yellow}[2/3] Installing dependencies...${colors.reset}`);
  console.log(`This may take a minute. Please wait...`);
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Dependencies installed${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error installing dependencies: ${error.message}${colors.reset}`);
    console.log(`\nTry running manually: npm install express cors`);
  }

  // Step 3: Verify environment
  console.log(`\n${colors.yellow}[3/3] Verifying environment...${colors.reset}`);
  
  // Check if index.js exists
  const indexPath = path.join(__dirname, 'index.js');
  if (!fs.existsSync(indexPath)) {
    console.error(`${colors.red}Error: index.js not found${colors.reset}`);
    console.log(`Make sure index.js is in the same directory as setup.js`);
    process.exit(1);
  }
  
  // Success message with clear instructions
  console.log(`\n${colors.bold}${colors.green}✓ SETUP COMPLETE!${colors.reset}`);
  console.log(`\n${colors.bold}${colors.cyan}HOW TO START THE SCANNER:${colors.reset}`);
  console.log(`${colors.bold}Just run:${colors.reset} npm start`);
  console.log(`Then open a new terminal window and run: npm run dev\n`);

  // Quick fix for common issues
  console.log(`${colors.yellow}If you get "module not found" errors:${colors.reset}`);
  console.log(`Run: npm install express cors\n`);

} catch (error) {
  console.error(`\n${colors.red}ERROR: ${error.message}${colors.reset}`);
  console.log(`\nTry installing dependencies manually:`);
  console.log(`npm install express cors`);
}
