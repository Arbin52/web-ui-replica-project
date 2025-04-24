
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

  // Check if we're in the right directory
  if (!fs.existsSync(path.join(__dirname, 'setup-scanner.js'))) {
    console.error(`${colors.red}Error: You must run this script from the local-scanner directory${colors.reset}`);
    process.exit(1);
  }

  // Step 1: Run the setup-scanner.js script
  console.log(`${colors.yellow}[1/2] Running setup-scanner.js...${colors.reset}`);
  try {
    execSync('node setup-scanner.js', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Setup script completed${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}Error running setup-scanner.js: ${error.message}${colors.reset}`);
    console.log(`\nTry running manually: node setup-scanner.js`);
    process.exit(1);
  }

  // Step 2: Add a helper script to package.json to make starting easier
  console.log(`${colors.yellow}[2/2] Setting up npm scripts...${colors.reset}`);
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Make sure we have a start script
    if (!packageJson.scripts || !packageJson.scripts.start) {
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      packageJson.scripts.start = "ts-node index.ts";
      
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2)
      );
    }
    
    console.log(`${colors.green}✓ npm scripts ready${colors.reset}\n`);
  }

  // Success message
  console.log(`\n${colors.bold}${colors.green}✓ SETUP COMPLETE!${colors.reset}`);
  console.log(`\n${colors.bold}${colors.cyan}HOW TO START THE SCANNER:${colors.reset}`);
  console.log(`${colors.bold}Just run:${colors.reset} npm start`);
  console.log(`Then open a new terminal window and run: npm run dev (for the main app)\n`);

} catch (error) {
  console.error(`\n${colors.red}ERROR: ${error.message}${colors.reset}`);
  console.log(`\nTry installing dependencies manually:`);
  console.log(`npm install ts-node express cors\n`);
}
