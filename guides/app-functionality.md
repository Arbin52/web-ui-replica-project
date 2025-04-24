
# WiFi Security Auditing App - Functionality Guide

This guide explains the main features of the application and how to use them.

## Main Features

### 1. Network Overview

- **Real-time Network Status**: View your current connection details
- **Connected Devices**: See all devices on your network
- **Network Statistics**: Bandwidth usage, connection quality, etc.
- **Quick Actions**: Scan network, refresh status, etc.

### 2. WiFi Management

- **Available Networks**: Scan and view nearby WiFi networks
- **Connect/Disconnect**: Manage WiFi connections
- **Saved Networks**: View and manage saved WiFi networks
- **Security Analysis**: View security information about networks

### 3. Network Management

- **Router Administration**: Configure router settings
- **Device Control**: Monitor and manage network devices
- **Bandwidth Management**: Analyze and control bandwidth usage
- **Advanced Settings**: Configure network protocols and settings

### 4. Security Features

- **Security Scan**: Check for network vulnerabilities
- **Intrusion Detection**: Monitor for suspicious activity
- **Device Authentication**: Manage device access permissions
- **Encryption Analysis**: Check WiFi security protocols

## Using Real-Time Network Data

To ensure you're seeing real network data:

1. **Enable the local scanner**:
   - Follow the scanner setup guide in `scanner-setup.md`
   - Make sure the scanner is running at http://localhost:3001

2. **Connect the application**:
   - The app automatically connects to the scanner
   - Status indicators will show "Live" when using real data
   - "Simulated" indicator shows when using mock data

3. **Perform a network scan**:
   - Click "Scan Network" on the dashboard
   - Wait for scan completion
   - View detected devices and network information

4. **Troubleshooting connection**:
   - If "Network scanner not available" appears, check that:
     - Scanner is running at http://localhost:3001
     - No firewall is blocking the connection
     - Try the "Retry" button in the error message

## Advanced Features

### Traceroute Analysis

1. Navigate to the Traceroute feature
2. Enter a domain name or IP address
3. Click "Start Traceroute"
4. View the path your traffic takes across the network

### Connection Speed Test

1. Go to the Speed Test section
2. Click "Start Speed Test"
3. View download/upload speeds and latency

### Security Scanning

1. Navigate to the Security section
2. Click "Start Security Scan"
3. Review identified vulnerabilities
4. Follow remediation steps for each issue
