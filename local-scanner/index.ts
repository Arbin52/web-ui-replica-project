
import express from 'express';
import cors from 'cors';
import { networkScanner } from './networkScanner';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/devices', async (req, res) => {
  try {
    const devices = await networkScanner.scan();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Network scan failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Network Scanner running on port ${PORT}`);
});
