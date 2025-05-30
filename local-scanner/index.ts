
import express from 'express';
import cors from 'cors';
import { networkScanner } from './networkScanner';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Add a /status endpoint to check if the server is running
app.get('/status', (req, res) => {
  res.json({ 
    status: 'running',
    pythonAvailable: networkScanner.isPythonAvailable,
    version: '1.1.0'
  });
});

// Endpoint to scan for all devices
app.get('/devices', async (req, res) => {
  try {
    const devices = await networkScanner.scan();
    res.json(devices);
  } catch (error) {
    console.error('Network scan failed:', error);
    res.status(500).json({ error: 'Network scan failed', details: error.message });
  }
});

// New endpoint to get details for a specific device
app.get('/device/:ip', async (req, res) => {
  try {
    const ipAddress = req.params.ip;
    const deviceDetails = await networkScanner.getDeviceDetails(ipAddress);
    
    if (deviceDetails) {
      res.json(deviceDetails);
    } else {
      res.status(404).json({ error: 'Device not found or details unavailable' });
    }
  } catch (error) {
    console.error(`Failed to get device details: ${error.message}`);
    res.status(500).json({ error: `Failed to get device details: ${error.message}` });
  }
});

// Endpoint to get Python scanner status
app.get('/scanner-status', async (req, res) => {
  try {
    if (networkScanner.isPythonAvailable) {
      try {
        const statusOutput = await networkScanner.runPythonScript(['status']);
        const status = JSON.parse(statusOutput);
        res.json({
          ...status,
          pythonAvailable: true
        });
      } catch (error) {
        // Handle case when status call fails (likely due to missing dependencies)
        console.error('Failed to get detailed scanner status:', error);
        res.json({
          pythonAvailable: true,
          modules: {
            scapy: false,
            nmap: false,
            netifaces: false,
            psutil: false
          },
          os: process.platform,
          error: error.message
        });
      }
    } else {
      res.json({
        pythonAvailable: false,
        reason: "Python not available on this system"
      });
    }
  } catch (error) {
    console.error('Failed to get scanner status:', error);
    res.status(500).json({ 
      error: 'Failed to get scanner status',
      message: error.message
    });
  }
});

// Endpoint to trigger a network scan (POST method)
app.post('/scan', (req, res) => {
  try {
    // Just acknowledge the request - the actual scan will happen when /devices is called
    res.json({ status: 'Scan initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate network scan' });
  }
});

app.listen(PORT, () => {
  console.log(`\n========================`);
  console.log(`Network Scanner Service`);
  console.log(`========================`);
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log(`✅ Status endpoint: http://localhost:${PORT}/status`);
  console.log(`✅ Python integration ${networkScanner.isPythonAvailable ? 'available ✓' : 'not available ✗'}`);

  if (networkScanner.isPythonAvailable) {
    console.log(`✅ Using Python for enhanced network scanning capabilities`);
  } else {
    console.log(`⚠️  Python not available - using fallback methods.`);
    console.log(`   For better results, install Python and required packages.`);
    console.log(`   See local-scanner-quick-start.md for instructions.`);
  }
  
  console.log(`\nTo use the scanner with the main application:`);
  console.log(`1. Keep this terminal window open`);
  console.log(`2. Start the main application in another terminal with 'npm run dev'`);
  console.log(`\n`);
});
