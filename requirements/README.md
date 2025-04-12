
# Application Requirements

This directory contains all the requirements files for the Network Management Application.

## Files Overview

- `python_requirements.txt` - Python packages required for network scanning functionality
- `node_requirements.txt` - Node.js packages for the local scanner service
- `frontend_requirements.txt` - React and UI libraries for the frontend application
- `system_requirements.txt` - System-level requirements and specifications

## Installation Instructions

### Python Dependencies
```bash
pip install -r requirements/python_requirements.txt
```

### Node.js Dependencies
For local scanner:
```bash
cd local-scanner
npm install
```

For frontend application:
```bash
npm install
```

## Verification

To verify that all dependencies are correctly installed:

1. Start the local scanner:
```bash
cd local-scanner
npm start
```

2. Check scanner status:
```bash
curl http://localhost:3001/status
```

3. Start the frontend application:
```bash
npm run dev
```

## Troubleshooting

If you encounter any issues with missing dependencies:

1. For Python issues:
   - Verify Python version with `python --version` or `python3 --version`
   - Check if the required modules are installed with `pip list`

2. For Node.js issues:
   - Verify Node.js version with `node --version`
   - Verify npm version with `npm --version`
   - Run `npm list` to check installed packages
