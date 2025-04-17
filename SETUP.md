
# Simple Setup Guide

This guide will help you quickly set up and run the application in VS Code.

## Running the Main Application

1. Open the project in VS Code
2. Open a terminal in VS Code (Terminal > New Terminal)
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm run dev
   ```
5. Your app will be running at http://localhost:8080

## Running the Network Scanner

The network scanner is required for device scanning functionality.

1. Open a new terminal in VS Code
2. Navigate to the scanner directory:
   ```
   cd scanner
   ```
3. Run the setup script:
   ```
   node setup.js
   ```
4. Start the scanner:
   ```
   npm start
   ```
5. The scanner will be running at http://localhost:3001

The scanner must be running alongside the main application for network scanning functionality to work.

## Quick Access Guide

- **Main application**: http://localhost:8080
- **Scanner status**: http://localhost:3001/status
- **Scanner devices**: http://localhost:3001/devices

## Troubleshooting Common Issues

### "Module not found" errors
If you encounter module not found errors:
```
npm install
```

And in the scanner directory:
```
cd scanner
npm install express cors
```

### Python dependency issues
The scanner will work with basic functionality even without Python.
For advanced features, you can manually install:
```
pip install getmac colorama requests
```
