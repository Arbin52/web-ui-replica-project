
# Network Scanner

This is a simple network scanner service that detects devices on your local network.

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
- Detect devices on your network
- View connection details
- Monitor network status

## Requirements

- Node.js 14+
- npm

