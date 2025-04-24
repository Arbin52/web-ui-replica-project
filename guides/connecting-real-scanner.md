
# Connecting to the Real-Time Network Scanner

This guide specifically covers how to ensure the app is using real network data.

## Prerequisites

- The network scanner must be running
- The main app must be running
- Both services should be on the same machine

## Verifying Scanner Status

1. **Check if scanner is running**:
   - Open http://localhost:3001/status in your browser
   - You should see: `{"status":"running","pythonAvailable":true,"version":"1.0.0"}`
   - The `pythonAvailable` field indicates if enhanced scanning features are available

2. **Test scanner endpoints**:
   - http://localhost:3001/devices - Shows detected devices
   - http://localhost:3001/scanner-status - Shows detailed scanner information

## Connecting the App to the Scanner

The app automatically tries to connect to the scanner at http://localhost:3001. This is configured in the `.env` file:

```
VITE_SCANNER_URL=http://localhost:3001
```

When both services are running correctly:

1. Open the main app at http://localhost:8080
2. The app will connect to the scanner automatically
3. You'll see real network data in the dashboard
4. A "Live" indicator will appear when real data is being used

## Common Connection Issues

### "Network scanner not available" Error

This means the app cannot connect to the scanner. Check:

1. Is the scanner running? (http://localhost:3001/status)
2. Are both services on the same machine?
3. Is a firewall blocking port 3001?

Solution steps:
1. Make sure you've started the scanner:
   ```
   cd local-scanner
   node setup.js
   npm start
   ```
   
2. If TypeScript errors occur:
   ```
   node index.js
   ```

3. Click "Retry" in the app or refresh the page

### Scanner Running But No Data

If the scanner status page works but you don't see real data:

1. Try manually triggering a scan:
   - Click "Scan Network" in the app
   - Or visit http://localhost:3001/scan in your browser

2. Check console logs for errors:
   - Open browser developer tools (F12)
   - Look for any connection errors in the Console tab

### Connection Reset Errors

If you see connection reset errors:

1. The scanner might have crashed
2. Check the terminal where the scanner is running
3. Restart the scanner if needed:
   ```
   npm start
   ```
   or
   ```
   node index.js
   ```

## Using Simulated Data

If you can't get the real scanner working:

1. The app will automatically fall back to simulated data
2. You'll see a "Simulated" indicator in the app
3. You can still explore all features with mock data

## Advanced: Custom Scanner Configuration

For advanced users, you can modify the scanner settings:

1. Edit `local-scanner/index.js` or `local-scanner/index.ts`
2. Change the PORT variable to use a different port
3. Update the `.env` file to match your custom port
