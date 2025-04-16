
# Network Management Application - Quick Start Guide

This is a simplified guide for quickly setting up the Network Management Application.

## Prerequisites
- Node.js 16+
- npm 8+
- Python 3.8+
- pip 20+

## Quick Setup

### 1. Clone and Install
```bash
# Clone repository
git clone <REPOSITORY_URL>
cd network-management-app

# Install dependencies
npm install

# Install Python dependencies
pip install -r requirements/python_requirements.txt

# Install local scanner dependencies
cd local-scanner
npm install
cd ..
```

### 2. Run the Application

#### Terminal 1: Start Network Scanner
```bash
cd local-scanner
npm start
```

#### Terminal 2: Start Frontend
```bash
# From project root
npm run dev
```

### 3. Access the Application
Open your browser and go to: http://localhost:8080

## Common Issues

### Python Dependencies
If you have issues with Python dependencies:

```bash
# For Windows, use alternative package
pip install pynetinfo

# For Linux/macOS, install dev tools and rebuild
sudo apt-get install python3-dev build-essential  # Linux
xcode-select --install  # macOS
pip install --no-cache-dir netifaces==0.10.9
```

### Scanner Connection
If the frontend cannot connect to the scanner:
1. Check that scanner is running (http://localhost:3001/status)
2. Verify .env file has VITE_SCANNER_URL=http://localhost:3001
3. Restart both services

For more detailed instructions, see the full [INSTALLATION.md](./INSTALLATION.md) guide.
