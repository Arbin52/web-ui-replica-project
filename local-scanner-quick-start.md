
# Local Network Scanner - Quick Start Guide

This guide will help you set up and run the local network scanner service even if you're experiencing issues with the directory structure.

## Quick Setup Using the Setup Script

We've created a setup script to help you get started quickly. This script will:

1. Create the necessary directory structure
2. Copy required files
3. Install dependencies
4. Check for Python availability

Run the script with:

```bash
node setup-scanner.js
```

## Manual Setup Steps

If you prefer to set up manually, follow these steps:

### 1. Create Required Directories

```bash
# Create local-scanner directory if it doesn't exist
mkdir -p local-scanner/python
```

### 2. Set Up Required Files

```bash
# Copy Python requirements (if they exist)
cp requirements/python_requirements.txt local-scanner/python/requirements.txt

# Navigate to local-scanner directory
cd local-scanner
```

### 3. Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

### 4. Start the Scanner Service

```bash
# Start the network scanner
npm start
```

## Troubleshooting

If you encounter "Cannot find path" errors:
- Make sure you're running commands from the project root directory
- Verify the local-scanner directory exists

If the scanner starts but isn't detecting devices:
- Check if Python is installed: `python --version` or `python3 --version`
- Install Python dependencies: `pip install -r local-scanner/python/requirements.txt`

## What's Next?

After starting the network scanner service:
1. Open another terminal
2. Run the frontend application with `npm run dev`
3. Access the application in your browser at http://localhost:8080
