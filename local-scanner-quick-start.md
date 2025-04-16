
# Local Network Scanner - Quick Start Guide

This guide will help you set up and run the local network scanner service step-by-step, with a focus on Windows systems.

## Quick Summary

1. The scanner service runs on `http://localhost:3001`
2. You need to start the scanner service BEFORE launching the main application
3. The scanner requires Node.js and optionally Python for advanced features

## Step 1: Setup Your Environment

### Windows Requirements
- Node.js 16+ (Download from [nodejs.org](https://nodejs.org/))
- Python 3.8+ (Optional, for enhanced scanning - [Download Python](https://www.python.org/downloads/windows/))
- Make sure to check "Add Python to PATH" during installation!

### Create Scanner Directory Structure
```bash
# Open Command Prompt and navigate to project directory
cd network-management-app

# Create local-scanner directory if needed
mkdir local-scanner
mkdir local-scanner\python
```

## Step 2: Install Dependencies

```bash
# Navigate to the scanner directory
cd local-scanner

# Install Node.js dependencies
npm install
```

### Installing Python Dependencies on Windows
```bash
# Make sure Python is in your PATH
python --version

# Install required packages
pip install pynetinfo
pip install getmac
pip install colorama

# If you have issues with pynetinfo, try:
pip install --no-cache-dir pynetinfo
```

## Step 3: Start the Scanner Service

```bash
# From the local-scanner directory
npm start
```

You should see output like:
```
Network Scanner running on port 3001
Python integration available
Using Python for enhanced network scanning capabilities
```

## Step 4: Verify Scanner is Working

Open your browser and navigate to:
```
http://localhost:3001/status
```

You should see a JSON response showing the scanner is running:
```json
{
  "status": "running", 
  "pythonAvailable": true, 
  "version": "1.1.0"
}
```

## Troubleshooting

### "Network scanner not available" Error

If the application shows "Network scanner not available":

1. Make sure you're running the scanner service on port 3001
2. Check that it's running BEFORE launching the main application
3. Verify there are no firewall issues blocking local connections

### Python Package Issues on Windows

If you see Python-related errors:

1. Verify Python is installed and in your PATH:
   ```bash
   python --version
   ```

2. If you have issues with pynetinfo:
   ```bash
   # Try reinstalling
   pip uninstall pynetinfo
   pip install --no-cache-dir pynetinfo
   ```

3. If still experiencing issues, the scanner will automatically fall back to basic functionality, but with limited device detection

### Port Conflict Issues

If port 3001 is already in use:

1. Change the port in local-scanner/index.ts:
   ```typescript
   const PORT = process.env.PORT || 3002; // Change to a different port
   ```

2. Update your .env file to point to the new port:
   ```
   VITE_SCANNER_URL=http://localhost:3002
   ```

## Running the Full Application

Once your scanner is running:

1. Keep the scanner terminal open
2. Open a new terminal window
3. From the project root, run the main application:
   ```bash
   npm run dev
   ```
4. Open your browser to http://localhost:8080

## Need More Help?

If you continue having issues, check the full [DEPLOYMENT.md](./DEPLOYMENT.md) documentation or open an issue on our GitHub repository.
