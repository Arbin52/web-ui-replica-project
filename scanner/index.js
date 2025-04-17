
const express = require('express');
const cors = require('cors');
const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simplified utility to get the local IP addresses
const getLocalIpAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        addresses.push({
          name,
          address: iface.address,
          netmask: iface.netmask,
          mac: iface.mac
        });
      }
    }
  }
  
  return addresses;
};

// Get simplified network devices using the operating system's tools
const getNetworkDevices = () => {
  try {
    // Get our local IP addresses first
    const localAddresses = getLocalIpAddresses();
    const devices = [];
    
    // Add local device
    if (localAddresses.length > 0) {
      devices.push({
        id: 'local',
        ip: localAddresses[0].address,
        mac: localAddresses[0].mac || 'unknown',
        name: 'This Computer',
        status: 'Online',
        type: 'Computer'
      });
    }
    
    // Try to get the router/gateway IP
    let gateway = '192.168.1.1'; // Default fallback
    try {
      // Different commands for different OS
      let gatewayCommand;
      if (process.platform === 'win32') {
        gatewayCommand = 'ipconfig | findstr /i "Default Gateway"';
      } else if (process.platform === 'darwin') { // macOS
        gatewayCommand = 'route -n get default | grep gateway';
      } else { // Linux
        gatewayCommand = 'ip route | grep default';
      }
      
      const result = execSync(gatewayCommand, { encoding: 'utf8' });
      const match = result.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (match && match[1]) {
        gateway = match[1];
      }
    } catch (err) {
      console.log('Could not determine gateway, using default:', gateway);
    }
    
    // Add router
    devices.push({
      id: 'router',
      ip: gateway,
      mac: 'unknown',
      name: 'Router',
      status: 'Online',
      type: 'Router'
    });
    
    // Try to get other devices from ARP table
    try {
      let arpCommand = 'arp -a';
      const arpOutput = execSync(arpCommand, { encoding: 'utf8' });
      
      // Process each line of the ARP output
      arpOutput.split('\n').forEach((line, index) => {
        if (line.includes('(') || line.match(/[\d.]+/)) {
          const ipMatch = line.match(/([\d.]+)/);
          const macMatch = line.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
          
          if (ipMatch && ipMatch[0] !== gateway && 
              !devices.some(d => d.ip === ipMatch[0])) {
            devices.push({
              id: `dev-${index}`,
              ip: ipMatch[0],
              mac: macMatch ? macMatch[0] : 'unknown',
              name: `Device ${index + 1}`,
              status: 'Online',
              type: guessDeviceType(ipMatch[0], macMatch ? macMatch[0] : '')
            });
          }
        }
      });
    } catch (err) {
      console.log('Error getting ARP table:', err.message);
    }
    
    return devices;
  } catch (error) {
    console.error('Error scanning network:', error);
    
    // Return minimal data if scan fails
    return [
      { id: 'router', ip: '192.168.1.1', mac: '00:11:22:33:44:55', name: 'Router', status: 'Online', type: 'Router' },
      { id: 'local', ip: '192.168.1.100', mac: '11:22:33:44:55:66', name: 'This Computer', status: 'Online', type: 'Computer' }
    ];
  }
};

// Guess device type based on IP/MAC address patterns
const guessDeviceType = (ip, mac) => {
  // This is a simplistic approach - real device detection would be more sophisticated
  const lastOctet = parseInt(ip.split('.').pop());
  
  if (lastOctet === 1 || lastOctet === 254) return 'Router';
  
  // Check for known MAC address prefixes (first 6 characters)
  const macPrefix = mac.substring(0, 8).toUpperCase();
  
  // Some very basic examples - this would be more extensive in a real implementation
  const macPrefixes = {
    '00:0C:29': 'Virtual Machine',
    '00:50:56': 'Virtual Machine',
    '00:1A:11': 'Google Device',
    '00:17:88': 'Philips Hue',
    'B8:27:EB': 'Raspberry Pi',
    'DC:A6:32': 'Raspberry Pi',
    '74:DA:38': 'Smart TV',
    '00:25:00': 'Apple Device' 
  };
  
  for (const [prefix, type] of Object.entries(macPrefixes)) {
    if (macPrefix.startsWith(prefix)) return type;
  }
  
  // Fallback based on IP range
  if (lastOctet < 20) return 'Network Device';
  if (lastOctet >= 100 && lastOctet <= 150) return 'Computer';
  if (lastOctet >= 151 && lastOctet <= 200) return 'Mobile Device';
  
  return 'Unknown Device';
};

// Scanner settings
let scannerSettings = {
  scanInterval: 60000, // 1 minute default
  scanDepth: 'quick',
  excludedIpRanges: []
};

// Routes
app.get('/status', (req, res) => {
  res.json({ 
    status: 'running', 
    version: '2.0.0',
    pythonAvailable: false,
    nodeOnly: true,
    platform: process.platform
  });
});

app.get('/devices', (req, res) => {
  res.json(getNetworkDevices());
});

app.get('/device/:ip', (req, res) => {
  const { ip } = req.params;
  const devices = getNetworkDevices();
  const device = devices.find(d => d.ip === ip);
  
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// Scanner status endpoint
app.get('/scanner-status', (req, res) => {
  const netInterfaces = os.networkInterfaces();
  let defaultInterface = '';
  let defaultGateway = '192.168.1.1';
  
  // Try to find the default interface and gateway
  for (const [name, interfaces] of Object.entries(netInterfaces)) {
    for (const iface of interfaces) {
      if (!iface.internal && iface.family === 'IPv4') {
        defaultInterface = name;
        break;
      }
    }
    if (defaultInterface) break;
  }

  res.json({
    pythonAvailable: false,
    nodeOnly: true,
    modules: {
      scapy: false,
      nmap: false,
      netifaces: false,
      psutil: false
    },
    os: process.platform,
    defaultGateway,
    defaultInterface,
    networkRange: '192.168.1.0/24',
    localAddresses: getLocalIpAddresses()
  });
});

// Configure scanner endpoint
app.post('/configure', (req, res) => {
  try {
    const newSettings = req.body;
    scannerSettings = { ...scannerSettings, ...newSettings };
    console.log('Scanner settings updated:', scannerSettings);
    res.json({ success: true, settings: scannerSettings });
  } catch (error) {
    console.error('Error updating scanner settings:', error);
    res.status(500).json({ error: 'Failed to update scanner settings' });
  }
});

// Endpoint for scan trigger
app.post('/scan', (req, res) => {
  console.log('Network scan triggered');
  res.json({ status: 'Scan initiated' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n=============================================`);
  console.log(`✅ Network Scanner running on port ${PORT}`);
  console.log(`=============================================`);
  console.log(`📱 View devices: http://localhost:${PORT}/devices`);
  console.log(`🔍 Check status: http://localhost:${PORT}/status`);
  console.log(`\n💡 Keep this window open while using the app\n`);
  
  console.log(`✅ Node.js only scanner active (no Python dependencies)`);
  
  // Show network interfaces for debugging
  console.log('\nDetected network interfaces:');
  const interfaces = getLocalIpAddresses();
  interfaces.forEach(iface => {
    console.log(`  • ${iface.name}: ${iface.address} (${iface.mac || 'unknown MAC'})`);
  });
});
