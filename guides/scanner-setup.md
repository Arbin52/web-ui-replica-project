
# Network Scanner Setup Guide

This guide focuses specifically on setting up the local network scanner component.

## What is the Scanner?

The network scanner is a local service that:
- Detects devices on your network
- Provides real-time network information
- Scans for potential security issues
- Runs on port 3001 by default

## Step-by-Step Scanner Setup

1. **Navigate to scanner directory**
   ```
   cd local-scanner
   ```

2. **Run setup script**
   ```
   node setup.js
   ```
   This creates necessary files and installs dependencies.

3. **Start the scanner**
   ```
   npm start
   ```
   
   If you encounter TypeScript errors, use:
   ```
   node index.js
   ```

4. **Verify scanner is running**
   - Open http://localhost:3001/status in browser
   - Should see: `{"status":"running","pythonAvailable":true,"version":"1.0.0"}`

5. **Test device detection**
   - Open http://localhost:3001/devices
   - Should see a list of devices on your network

## Supported Features

The scanner provides these endpoints:
- `/status` - Scanner service status
- `/devices` - List of detected network devices
- `/device/:ip` - Details about specific device
- `/scanner-status` - Advanced scanner information
- `/scan` - Trigger a network scan

## Python Integration (Optional)

For enhanced features, you can enable Python integration:

1. Verify Python is installed:
   ```
   python --version
   ```

2. Install Python requirements:
   ```
   pip install getmac colorama requests
   ```
   
## Common Issues

1. **"Module not found" errors**
   ```
   npm install express cors
   npm install ts-node @types/express @types/cors
   ```

2. **Port already in use**
   - Check if another process is using port 3001
   - You can change the port in index.js/ts (PORT variable)

3. **Network permissions**
   - Some scanning features require elevated permissions
   - On Windows, you may need to run as Administrator
   - On Mac/Linux, you may need to use sudo

4. **TypeScript errors**
   - Use the JavaScript version: `node index.js`
