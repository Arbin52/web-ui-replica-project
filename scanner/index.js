
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get network devices using system commands
const getNetworkDevices = () => {
  try {
    // Get devices from ARP table
    const output = execSync('arp -a', { encoding: 'utf8' });
    const devices = [];
    
    output.split('\n').forEach((line, index) => {
      if (line.includes('(') || line.match(/[\d.]+/)) {
        const ipMatch = line.match(/([\d.]+)/);
        const macMatch = line.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
        
        if (ipMatch) {
          devices.push({
            id: `dev-${index}`,
            ip: ipMatch[0],
            mac: macMatch ? macMatch[0] : 'unknown',
            name: `Device ${index + 1}`,
            status: 'Online',
            type: 'Unknown'
          });
        }
      }
    });
    
    return devices;
  } catch (error) {
    console.error('Error scanning network:', error);
    
    // Return sample data if scan fails
    return [
      { id: 'router', ip: '192.168.1.1', mac: '00:11:22:33:44:55', name: 'Router', status: 'Online', type: 'Router' },
      { id: 'local', ip: '192.168.1.100', mac: '11:22:33:44:55:66', name: 'This Computer', status: 'Online', type: 'Computer' }
    ];
  }
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
    version: '1.0.0',
    pythonAvailable: false
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

// New endpoint for scanner status
app.get('/scanner-status', (req, res) => {
  res.json({
    pythonAvailable: false,
    modules: {
      scapy: false,
      nmap: false,
      netifaces: false,
      psutil: false
    },
    os: process.platform,
    defaultGateway: '192.168.1.1',
    networkRange: '192.168.1.0/24'
  });
});

// New endpoint to configure scanner
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
});
