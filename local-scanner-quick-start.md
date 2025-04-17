
# Local Network Scanner - Quick Start Guide

## Simple Steps to Run the Scanner

1. Open a terminal window
2. Navigate to the `local-scanner` directory:
   ```
   cd local-scanner
   ```
3. Run the setup script:
   ```
   node setup-scanner.js
   ```
4. Start the scanner:
   ```
   npm start
   ```
5. Keep this terminal window open
6. In a new terminal window, run the main application:
   ```
   npm run dev
   ```

## Common Issues

### "Module not found" errors
If you see "module not found" errors when running the setup or starting the scanner:
```
npm install ts-node express cors
```

### Scanner not detected by the app
1. Make sure the scanner is running on port 3001
2. Verify the scanner is running BEFORE starting the main app
3. Check scanner status at http://localhost:3001/status in your browser
4. Click "Refresh Scanner Status" in the app

## Scanner Service
- The scanner runs on: http://localhost:3001
- Status endpoint: http://localhost:3001/status
- Devices endpoint: http://localhost:3001/devices

## Need More Help?
See the full documentation in DEPLOYMENT.md
