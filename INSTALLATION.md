
# Network Management Application - Installation Guide

This guide will walk you through the complete process of setting up, running, and deploying the Network Management Application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Running the Application](#running-the-application)
4. [Troubleshooting](#troubleshooting)
5. [Deployment](#deployment)

## Prerequisites

### System Requirements
- **Node.js**: Version 16.0.0 or higher
  - [Download from nodejs.org](https://nodejs.org/)
  - Verify with: `node --version`
- **npm**: Version 8.0.0 or higher
  - Comes with Node.js
  - Verify with: `npm --version`
- **Python**: Version 3.8 or higher
  - [Download from python.org](https://python.org/)
  - Verify with: `python --version` or `python3 --version`
- **pip**: Version 20.0.0 or higher
  - Usually comes with Python
  - Verify with: `pip --version` or `pip3 --version`
- **Git**: Latest version recommended
  - [Download from git-scm.com](https://git-scm.com/)

### Operating System Compatibility
- Windows 10+
- macOS 10.15+
- Ubuntu 20.04+ or other Linux distributions

## Project Setup

### 1. Clone the Repository
```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to the project directory
cd network-management-app
```

### 2. Install Frontend Dependencies
```bash
# From the project root directory
npm install
```

### 3. Install Python Dependencies

#### For macOS and Linux:
```bash
# Install Python dependencies
pip install -r requirements/python_requirements.txt
```

#### For Windows:
```bash
# Install Python dependencies with Windows-specific packages
pip install -r requirements/python_requirements.txt
```

### 4. Install Local Scanner Dependencies
```bash
# Navigate to the local-scanner directory
cd local-scanner

# Install local scanner dependencies
npm install

# Return to project root
cd ..
```

## Running the Application

### 1. Start the Local Network Scanner Service
```bash
# In a new terminal, navigate to the local-scanner directory
cd local-scanner

# Start the network scanner service
npm start
```

You should see output indicating that the Network Scanner is running on port 3001.

### 2. Start the Frontend Application
```bash
# In a different terminal, from the project root
npm run dev
```

The application should now be running at http://localhost:8080

### 3. Verify Installation
- Open your browser and navigate to http://localhost:8080
- Check if the network scanner is connected by looking for "Connected to network scanner" message
- If the scanner isn't connected, visit http://localhost:3001/status to check scanner status

## Troubleshooting

### Python Dependencies Issues

#### netifaces Installation Problems:
If you encounter issues with installing netifaces:

**For Windows**:
```bash
# Try installing wheel manually
pip install wheel
# Then install from a pre-built wheel
pip install pynetinfo
```

**For Linux**:
```bash
# Install system dependencies
sudo apt-get update
sudo apt-get install python3-dev build-essential
# Then reinstall netifaces
pip install --no-cache-dir netifaces==0.10.9
```

**For macOS**:
```bash
# Install XCode command-line tools
xcode-select --install
# Then reinstall netifaces
pip install --no-cache-dir netifaces==0.10.9
```

#### Other Python Module Issues:
```bash
# Update pip
pip install --upgrade pip

# Reinstall all dependencies
pip install -r requirements/python_requirements.txt --force-reinstall
```

### Network Scanner Connection Issues

If the frontend can't connect to the network scanner:

1. Verify the scanner is running: http://localhost:3001/status
2. Check `.env` file and ensure `VITE_SCANNER_URL=http://localhost:3001`
3. Restart both the scanner service and frontend application

### Browser Console Errors

If you see errors in the browser console:
1. Open browser developer tools (F12 or right-click > Inspect)
2. Check console for specific errors
3. Verify all required dependencies are installed

## Deployment

### 1. Build the Frontend Application
```bash
# From the project root
npm run build
```

This creates a production-ready build in the `dist` directory.

### 2. Deploy Frontend to Static Hosting

You can deploy the frontend to various static hosting providers:

#### Netlify:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy
```

#### Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

### 3. Deploy Network Scanner Service

The network scanner service needs to run on a server with Python support:

#### Self-hosted Option:
1. Install Node.js and Python on your server
2. Copy the `local-scanner` directory to your server
3. Install dependencies: `npm install` and `pip install -r python/requirements.txt`
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start index.ts --interpreter ./node_modules/.bin/ts-node
   ```

#### Docker Option:
1. Create a Dockerfile in the local-scanner directory:
   ```dockerfile
   FROM node:16-alpine

   # Install Python and required packages
   RUN apk add --no-cache python3 py3-pip build-base python3-dev

   WORKDIR /app

   # Copy package files and install Node dependencies
   COPY package*.json ./
   RUN npm install

   # Copy Python requirements and install
   COPY python/ ./python/
   RUN pip3 install -r ./python/requirements.txt

   # Copy application files
   COPY . .

   # Expose the port
   EXPOSE 3001

   # Start the application
   CMD ["npm", "start"]
   ```

2. Build and run the Docker container:
   ```bash
   docker build -t network-scanner .
   docker run -p 3001:3001 network-scanner
   ```

### 4. Configure the Deployed Frontend

Update the deployed frontend to point to your deployed scanner service:

1. Set the environment variable `VITE_SCANNER_URL` to your deployed scanner URL
2. Rebuild and redeploy the frontend

## Advanced Configuration

### Environment Variables
Create a `.env` file in the project root with these options:
```
VITE_SCANNER_URL=http://your-scanner-service-url
```

### Network Scanner Configuration
For advanced scanner configuration, see the documentation in `local-scanner/python/TECHNICAL_REPORT.md`.
