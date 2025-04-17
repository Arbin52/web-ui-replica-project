
# Network Scanner (Node.js Edition)

This is a simplified network scanner service that detects devices on your local network using only Node.js (no Python dependencies).

## Quick Setup

1. Run setup script:
   ```
   node setup.js
   ```
   
2. Start the scanner:
   ```
   npm start
   ```

3. Verify it's running:
   - Open http://localhost:3001/status in your browser
   - You should see a response indicating the scanner is active

## What Does This Do?

This scanner runs as a local service that allows the main application to:
- Detect devices on your network using Node.js tools
- View connection details
- Monitor network status

## Requirements

- Node.js 14+
- npm

## How It Works

This Node.js-only scanner:
1. Detects local network interfaces
2. Identifies the router/gateway
3. Uses the ARP table to discover other devices
4. Makes educated guesses about device types based on IP/MAC patterns

## Troubleshooting

### Module Not Found Errors

If you see errors related to missing Node.js modules:

```
npm install express cors
```

The scanner will work without any Python installation!
