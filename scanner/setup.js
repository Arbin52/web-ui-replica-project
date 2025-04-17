
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("\n\x1b[36m===== NETWORK SCANNER SETUP =====\x1b[0m\n");

// Create package.json
console.log("📦 Setting up package.json...");
const packageJson = {
  "name": "network-scanner",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// Create basic requirements.txt file for Python dependencies
console.log("📝 Creating Python requirements file...");
const requirementsDir = path.join(__dirname, 'python');
if (!fs.existsSync(requirementsDir)) {
  fs.mkdirSync(requirementsDir, { recursive: true });
}

// Create a simplified requirements file that's more likely to install without errors
const basicRequirements = `
# Basic network scanning requirements - simplified for compatibility
getmac>=0.8.2
requests>=2.28.0
colorama>=0.4.4

# System-specific packages - these will be installed only if compatible
# These are optional and the scanner will work without them
pynetinfo>=0.1.0; platform_system=="Windows"
netifaces==0.10.9; platform_system!="Windows"
`;

const reqPath = path.join(requirementsDir, 'requirements.txt');
fs.writeFileSync(reqPath, basicRequirements);

// Check if Python is available and try to install basic dependencies
console.log("🔍 Checking for Python...");
let pythonAvailable = false;
let pythonCommand = '';

try {
  // Try python3 first (common on Linux/Mac)
  execSync('python3 --version', { stdio: 'pipe' });
  pythonCommand = 'python3';
  pythonAvailable = true;
  console.log("✅ Found Python 3");
} catch (err) {
  try {
    // Try python (common on Windows)
    execSync('python --version', { stdio: 'pipe' });
    pythonCommand = 'python';
    pythonAvailable = true;
    console.log("✅ Found Python");
  } catch (e) {
    console.log("❌ Python not found. Will use basic network scanning only.");
  }
}

// Try to install Python dependencies if Python is available
if (pythonAvailable) {
  console.log("📦 Installing Python dependencies...");
  try {
    if (process.platform === 'win32') {
      // On Windows, avoid trying to install problematic packages
      execSync(`${pythonCommand} -m pip install getmac colorama`, { stdio: 'inherit' });
      console.log("✅ Installed basic Python packages");
      
      // Try to install pynetinfo but don't fail if it doesn't work
      try {
        execSync(`${pythonCommand} -m pip install pynetinfo`, { stdio: 'inherit' });
      } catch (err) {
        console.log("⚠️  Could not install pynetinfo. Basic functionality will still work.");
      }
    } else {
      // On Unix systems
      execSync(`${pythonCommand} -m pip install getmac colorama`, { stdio: 'inherit' });
      
      // Try netifaces but don't fail if it doesn't work
      try {
        execSync(`${pythonCommand} -m pip install netifaces==0.10.9`, { stdio: 'inherit' });
      } catch (err) {
        console.log("⚠️  Could not install netifaces. Basic functionality will still work.");
      }
    }
  } catch (err) {
    console.log("⚠️  Could not install Python packages. Basic functionality will still work.");
    console.log(`   Error: ${err.message}`);
  }
}

// Create index.js if it doesn't exist
console.log("📝 Creating scanner service...");
if (!fs.existsSync('index.js')) {
  const indexContent = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
  fs.writeFileSync('index.js', indexContent);
}

// Install dependencies
console.log("📥 Installing dependencies...");
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log("\n\x1b[32m✅ SETUP COMPLETE!\x1b[0m");
  console.log("\n\x1b[36mTo start the scanner:\x1b[0m");
  console.log("  npm start");
  console.log("\n\x1b[36mThen open a new terminal and run the main app:\x1b[0m");
  console.log("  npm run dev\n");
} catch (err) {
  console.error("\n\x1b[31mError installing dependencies. Try manually:\x1b[0m");
  console.log("  npm install express cors\n");
}
