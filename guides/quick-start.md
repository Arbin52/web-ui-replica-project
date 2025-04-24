
# WiFi Security Auditing - Quick Start Guide

## Run In Just 6 Steps

1. **Open project in VSCode**

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up scanner**
   ```
   cd local-scanner
   node setup.js
   ```

4. **Start scanner**
   ```
   npm start
   ```
   (If errors: `node index.js`)

5. **Start main app** (in new terminal)
   ```
   cd ..
   npm run dev
   ```

6. **Open in browser**
   - http://localhost:8080

## Troubleshooting

If scanner not connecting:
- Verify scanner running: http://localhost:3001/status
- Try refreshing or restarting app

Need help? See full instructions in STEP-BY-STEP.md
