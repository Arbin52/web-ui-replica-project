
# Local Network Scanner

This is a simple network scanner service that provides device detection and network analysis capabilities.

## Prerequisites

1. Node.js 16+ installed
2. Python 3.6+ (optional, for enhanced scanning)

## Setup

### Basic Setup

1. Install Node dependencies:
   ```bash
   cd local-scanner
   npm install
   ```

2. For enhanced scanning (optional), install Python requirements:
   ```bash
   pip install -r python/requirements.txt
   ```

## Running the Scanner

You can start the network scanner with:

```bash
npm start
```

The scanner will be available at http://localhost:3001

## Available Endpoints

- `GET /status` - Check if the scanner is running
- `GET /devices` - Get all connected devices
- `GET /device/:ip` - Get details for a specific device
- `GET /scanner-status` - Get detailed scanner status
- `POST /scan` - Initiate a network scan

## VS Code Integration

This scanner is designed to work with the Network Management app when developing in VS Code.

### Running Both Projects Together

1. Start the scanner service
2. Start the main React application
3. Use the Network Management dashboard to view and analyze your network
