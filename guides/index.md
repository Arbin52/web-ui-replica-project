
# WiFi Security Auditing Application Guide

Welcome to the WiFi Security Auditing application! This guide will help you get started with the app.

## Available Guides

- [Step-by-Step Setup](../STEP-BY-STEP.md) - Complete setup instructions
- [Quick Start](./quick-start.md) - Get up and running fast
- [Scanner Setup](./scanner-setup.md) - Set up the network scanner
- [App Functionality](./app-functionality.md) - Learn about app features
- [Connecting Real Scanner](./connecting-real-scanner.md) - Use real network data

## Directory Structure

```
/
├── src/               # Main application source code
├── local-scanner/     # Network scanner service
├── guides/            # These guide files
└── STEP-BY-STEP.md    # Complete setup instructions
```

## Quick Start Commands

| Step | Command | Location |
|------|---------|----------|
| 1 | `npm install` | Root directory |
| 2 | `cd local-scanner` | |
| 3 | `node setup.js` | local-scanner/ |
| 4 | `npm start` | local-scanner/ |
| 5 | `cd ..` | Back to root |
| 6 | `npm run dev` | Root directory |

Then open: http://localhost:8080

## Need Help?

If you encounter issues:

1. Check the appropriate guide file
2. Make sure the scanner is running (http://localhost:3001/status)
3. Check the main app is running (http://localhost:8080)
4. Try restarting both services if needed
