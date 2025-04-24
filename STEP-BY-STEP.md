
# WiFi Security Auditing App - Step-by-Step Guide

This guide will walk you through setting up and running the WiFi Security Auditing application from start to finish.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Visual Studio Code](https://code.visualstudio.com/)
- Git (optional, for cloning the repository)

## Step 1: Open the Project in VSCode

1. Open Visual Studio Code
2. Use **File > Open Folder** to open the project folder
3. Alternatively, you can open a terminal and run:
   ```
   code /path/to/wifi-security-app
   ```

## Step 2: Install Main Application Dependencies

1. Open a terminal in VSCode (**Terminal > New Terminal**)
2. In the project root directory, run:
   ```
   npm install
   ```
3. Wait for all dependencies to be installed

## Step 3: Set Up the Network Scanner (Important!)

For real device scanning and network analysis, you need to set up the local scanner:

1. Open a **new terminal** in VSCode
2. Navigate to the local-scanner directory:
   ```
   cd local-scanner
   ```
3. Run the setup script:
   ```
   node setup.js
   ```
   This will:
   - Create necessary files
   - Install required dependencies
   - Set up the scanner service

4. Start the scanner service:
   ```
   npm start
   ```

   If you encounter TypeScript errors, use the JavaScript version instead:
   ```
   node index.js
   ```

5. **IMPORTANT**: Keep this terminal running! The scanner needs to stay active.
   - Verify it's working by visiting http://localhost:3001/status in your browser
   - You should see: `{"status":"running","pythonAvailable":true,"version":"1.0.0"}`

## Step 4: Start the Main Application

1. Open a **new terminal** in VSCode (keep the scanner terminal running!)
2. Make sure you're in the root directory of the project
3. Start the application:
   ```
   npm run dev
   ```
4. The app will be accessible at http://localhost:8080 in your browser

## Step 5: Connect to Real Network Data

1. With both the scanner and main app running:
   - The app will automatically detect the scanner at http://localhost:3001
   - Real network data should appear in the dashboard

2. If you don't see real network data:
   - Click the "Retry" or "Refresh" button in the app
   - Make sure both the scanner and main app are running
   - Visit http://localhost:3001/devices in your browser to verify the scanner is returning device data

## Troubleshooting

### Scanner Not Detected

If the app doesn't detect the scanner:

1. Verify the scanner is running at http://localhost:3001/status
2. Check that the environment variable is set correctly:
   - The app should be looking for the scanner at http://localhost:3001
   - This is configured in the `.env` file with `VITE_SCANNER_URL=http://localhost:3001`

### TypeScript Errors in Scanner

If you encounter TypeScript errors when starting the scanner:

1. Use the JavaScript fallback version:
   ```
   node index.js
   ```

### "Module not found" Errors

If you see "module not found" errors:

1. In the local-scanner directory:
   ```
   npm install express cors
   ```
2. For TypeScript support:
   ```
   npm install ts-node @types/express @types/cors
   ```

## Advanced: Python Integration

For advanced features, the scanner can use Python capabilities:

1. Check if Python is available:
   ```
   python --version
   ```
   or 
   ```
   python3 --version
   ```

2. Install Python dependencies (optional):
   ```
   pip install getmac colorama requests
   ```
   or
   ```
   pip3 install getmac colorama requests
   ```

## Directory Structure

- **Root directory**: Main application files
  - Run `npm install` and `npm run dev` here
- **local-scanner/**: Network scanner service
  - Run `node setup.js` and `npm start` here

## Command Summary

| Directory | Command | Purpose |
|-----------|---------|---------|
| Root | `npm install` | Install main app dependencies |
| Root | `npm run dev` | Start the main application |
| local-scanner | `node setup.js` | Set up the scanner |
| local-scanner | `npm start` | Start the network scanner |
| local-scanner | `node index.js` | Alternative to start scanner (if TypeScript errors) |

Remember: The network scanner must be running before the main app for real-time network data!
