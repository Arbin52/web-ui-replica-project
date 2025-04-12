
# Network Management Application

## Prerequisites

### System Requirements
- Python 3.8+
- Node.js 16+
- npm 8+

### Python Dependencies
Install Python dependencies:
```bash
pip install -r python/requirements.txt
```

### Node.js Dependencies
```bash
# Install local scanner dependencies
cd local-scanner
npm install

# Install React application dependencies
cd ..
npm install
```

## Running the Application

### Start Local Scanner
```bash
cd local-scanner
npm start
```

### Start React Application
```bash
npm run dev
```

## Troubleshooting

### Python Module Issues
- Ensure all Python dependencies are installed
- Check Python version compatibility
- Verify network scanning permissions

### Network Scanner Configuration
- Update `.env` file with correct scanner URL
- Ensure firewall allows local network scanning

## Development

### Running Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

## License
[Specify your license here]
