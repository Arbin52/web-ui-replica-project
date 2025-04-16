
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\n=================================');
console.log('Local Network Scanner Setup Tool');
console.log('=================================\n');

// Check if we're running from the right directory
const isInCorrectDirectory = fs.existsSync('package.json') && 
                            fs.existsSync('index.ts') && 
                            fs.existsSync('networkScanner.ts');

if (!isInCorrectDirectory) {
  console.error('⛔️ Error: Please run this script from inside the local-scanner directory.');
  console.log('   Navigate to the local-scanner directory first with:');
  console.log('   cd local-scanner');
  console.log('   Then run: node setup-scanner.js');
  process.exit(1);
}

// Create necessary directory structure
console.log('📁 Setting up directory structure...');
if (!fs.existsSync('python')) {
  fs.mkdirSync('python', { recursive: true });
  console.log('   Created python directory');
} else {
  console.log('   Python directory already exists');
}

// Helper function for executing commands with error handling
function execCommand(command, errorMessage) {
  try {
    console.log(`   Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`⚠️  ${errorMessage}`);
    console.error(`   ${error.message}`);
    return false;
  }
}

// Check for Node.js requirements
console.log('\n🔍 Checking Node.js setup...');
execCommand('node --version', 'Failed to get Node.js version');

// Install npm packages if needed
if (!fs.existsSync('node_modules')) {
  console.log('\n📦 Installing Node.js dependencies...');
  execCommand('npm install', 'Failed to install Node.js dependencies');
} else {
  console.log('✅ Node.js dependencies already installed');
}

// Check Python availability
console.log('\n🐍 Checking Python setup...');

// Determine Python command to use
let pythonCommand = '';
try {
  execSync('python --version', { stdio: 'ignore' });
  pythonCommand = 'python';
} catch (e) {
  try {
    execSync('python3 --version', { stdio: 'ignore' });
    pythonCommand = 'python3';
  } catch (e) {
    console.log('⚠️  Python not found. Scanner will operate with reduced functionality.');
    pythonCommand = '';
  }
}

if (pythonCommand) {
  console.log(`✅ Python found: ${pythonCommand}`);
  
  // Install Python packages on Windows
  if (os.platform() === 'win32') {
    console.log('\n📦 Installing Windows-specific Python packages...');
    execCommand(`${pythonCommand} -m pip install pynetinfo --no-cache-dir`, 'Failed to install pynetinfo');
    execCommand(`${pythonCommand} -m pip install getmac`, 'Failed to install getmac');
    execCommand(`${pythonCommand} -m pip install colorama`, 'Failed to install colorama');
  } else {
    // Install Python packages on Unix-like systems
    console.log('\n📦 Installing Python dependencies...');
    
    // Check if requirements.txt exists
    const requirementsPath = path.join('python', 'requirements.txt');
    if (fs.existsSync(requirementsPath)) {
      execCommand(`${pythonCommand} -m pip install -r ${requirementsPath}`, 'Failed to install Python requirements');
    } else {
      console.log('⚠️  Python requirements.txt not found. Installing core packages individually...');
      execCommand(`${pythonCommand} -m pip install netifaces`, 'Failed to install netifaces');
      execCommand(`${pythonCommand} -m pip install getmac`, 'Failed to install getmac');
      execCommand(`${pythonCommand} -m pip install scapy`, 'Failed to install scapy');
    }
  }
}

// Final output
console.log('\n✅ Setup completed!');
console.log('\nTo start the scanner:');
console.log('   npm start');
console.log('\nTo verify it\'s working:');
console.log(`   Open http://localhost:3001/status in your browser`);
console.log('\nIf you encounter issues, check local-scanner-quick-start.md for troubleshooting.\n');
