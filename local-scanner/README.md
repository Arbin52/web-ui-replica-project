
# Local Network Scanner

This is a comprehensive network scanner service that provides advanced device detection and network analysis capabilities using Python and Node.js.

## Technology Stack

- **Frontend:** React
- **Backend API:** Node.js with Express
- **Network Scanning:** Python

## Python Network Scanner

### Key Features

- **Advanced Network Discovery**
  - Scan local network devices
  - Detect device types and manufacturers
  - Retrieve detailed network information

### Scanning Capabilities

The Python backend (`network_scanner.py`) leverages multiple libraries for comprehensive network analysis:

- **Scapy:** Advanced packet manipulation and network scanning
- **python-nmap:** Network discovery and port scanning
- **netifaces:** Network interface information retrieval
- **psutil:** System and network resource monitoring

### Supported Scanning Methods

1. **Scapy Scanning:** Most accurate device detection
2. **ARP (Address Resolution Protocol):** Fallback device discovery
3. **nmap:** Additional network scanning capabilities

### Python Script Functionality

- Detect devices on local network
- Identify device types (smartphone, computer, IoT)
- Retrieve manufacturer information
- Determine network range and gateway
- Collect system and network metadata

## Prerequisites

1. Python 3.6+
2. Node.js 16+

## Python Setup

1. Install Python dependencies:
   ```bash
   pip install -r python/requirements.txt
   ```

## Running the Scanner

```bash
# Start the Node.js backend (which calls the Python script)
npm start
```

## Endpoints Powered by Python

- `/devices`: Discover network devices
- `/device/:ip`: Get detailed device information
- `/scanner-status`: Check Python module availability

## Advanced Usage

The Python backend supports flexible network scanning with multiple detection strategies, ensuring robust device discovery across different network configurations.

## Troubleshooting

- Ensure all required Python packages are installed
- Check Python version compatibility
- Verify network permissions for scanning
