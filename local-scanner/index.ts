
import express from 'express';
import cors from 'cors';
import { networkScanner } from './networkScanner';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Add a /status endpoint to check if the server is running
app.get('/status', (req, res) => {
  res.json({ status: 'running' });
});

// Endpoint to scan for all devices
app.get('/devices', async (req, res) => {
  try {
    const devices = await networkScanner.scan();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Network scan failed' });
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
    res.status(500).json({ error: `Failed to get device details: ${error.message}` });
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
  console.log(`Network Scanner running on port ${PORT}`);
  console.log(`Python integration ${networkScanner.isPythonAvailable ? 'available' : 'not available'}`);
});
