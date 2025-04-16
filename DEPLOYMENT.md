
# Network Management Application - Deployment Guide

This guide focuses specifically on deploying the Network Management Application.

## Frontend Deployment

### Build the Application
```bash
# From project root
npm run build
```

This creates a production-ready build in the `dist` directory.

### Deployment Options

#### Option 1: Static Hosting (Netlify/Vercel)
Best for the React frontend only:

```bash
# Netlify
npm install -g netlify-cli
netlify deploy

# Vercel
npm install -g vercel
vercel
```

#### Option 2: GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
# "scripts": {
#   "predeploy": "npm run build",
#   "deploy": "gh-pages -d dist"
# }

# Deploy
npm run deploy
```

## Network Scanner Service Deployment

The network scanner requires a server with both Node.js and Python.

### Option 1: Traditional Server Deployment

1. Provision a server (e.g., DigitalOcean, AWS EC2, etc.)
2. Set up the server:

```bash
# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
sudo apt-get install -y python3 python3-pip python3-dev build-essential

# Clone the repository
git clone <REPOSITORY_URL>
cd network-management-app/local-scanner

# Install dependencies
npm install
pip3 install -r python/requirements.txt

# Use PM2 to keep the service running
npm install -g pm2
pm2 start index.ts --interpreter ./node_modules/.bin/ts-node
pm2 save
pm2 startup
```

### Option 2: Docker Deployment

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

### Option 3: Platform as a Service (Heroku)

```bash
# Install Heroku CLI
npm install -g heroku

# Create Heroku app
heroku create network-scanner-app

# Set buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/python

# Deploy
git subtree push --prefix local-scanner heroku main
```

## Connecting Frontend to Deployed Scanner

1. After deploying the scanner service, get its URL (e.g., https://your-scanner-service.com)

2. Create an environment variable file for the frontend deployment:
   - For Netlify: Create a `.env.production` file and set environment variables in the Netlify dashboard
   - For Vercel: Configure environment variables in the Vercel dashboard
   - For static hosting: Update the `.env.production` file before building

3. Set the scanner URL:
```
VITE_SCANNER_URL=https://your-scanner-service.com
```

4. Rebuild and redeploy the frontend

## Security Considerations

1. Enable HTTPS for both the frontend and scanner service
2. Add authentication to the scanner service API endpoints
3. Consider adding CORS restrictions to the scanner service
4. Set up a reverse proxy (e.g., Nginx) for additional security

## Monitoring and Maintenance

1. Set up logging for the scanner service:
```bash
# Using PM2
pm2 logs network-scanner

# Using Docker
docker logs network-scanner
```

2. Monitor resource usage to ensure the service runs smoothly:
```bash
# Check CPU and memory usage
pm2 monit
```

3. Set up automatic updates and restart:
```bash
# Create a simple update script
echo '#!/bin/bash
cd /path/to/app
git pull
npm install
pm2 restart network-scanner' > update.sh
chmod +x update.sh

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/update.sh
```

For more detailed instructions on the complete setup process, see [INSTALLATION.md](./INSTALLATION.md).
