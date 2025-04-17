
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

// Create directories if they don't exist
console.log("📁 Creating directories...");
const pythonDir = path.join(__dirname, 'python');
if (!fs.existsSync(pythonDir)) {
  fs.mkdirSync(pythonDir, { recursive: true });
}

// Create a simplified requirements file that's more likely to install without errors
console.log("📝 Creating Python requirements file...");
const basicRequirements = `
# Basic network scanning requirements - simplified for maximum compatibility
getmac>=0.8.2
requests>=2.28.0
colorama>=0.4.4

# These packages might require compilation, so they're optional
# Uncomment if needed and if you have a C compiler:
# scapy>=2.4.5
# netifaces==0.10.9
# pynetinfo>=0.1.0
`;

const reqPath = path.join(pythonDir, 'requirements.txt');
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
    // Install just the minimal requirements to avoid compilation issues
    execSync(`${pythonCommand} -m pip install getmac colorama requests`, { 
      stdio: 'inherit',
      timeout: 60000 // 60 second timeout for pip
    });
    console.log("✅ Installed basic Python packages");
  } catch (err) {
    console.log("⚠️  Could not install Python packages. Basic functionality will still work.");
    console.log(`   Error: ${err.message}`);
    console.log("   This is not critical - the scanner will work with reduced functionality.");
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
