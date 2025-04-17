
# Network Management App - Quick Start Guide

## Setup and Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Network Scanner
```bash
# In first terminal window
cd scanner
node setup.js
npm start
```

### Step 3: Start Main Application
```bash
# In second terminal window
npm run dev
```

### Step 4: Open Application
- Open your browser to http://localhost:8080

## Network Scanner Troubleshooting

If you have issues with the scanner:
1. Make sure it's running on port 3001
2. Check status at http://localhost:3001/status
3. Run `npm install ts-node express cors` in scanner directory

For more details, see scanner/README.md
