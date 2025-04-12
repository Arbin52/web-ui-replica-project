
#!/usr/bin/env python3
import json
import sys
import socket
import subprocess
import platform
import re
from datetime import datetime

def get_os():
    """Detect the operating system."""
    return platform.system()

def scan_network_devices():
    """Scan for devices on the network and return a list of them."""
    os_name = get_os()
    devices = []
    
    try:
        if os_name == "Linux" or os_name == "Darwin":  # Linux or macOS
            # Use ARP to get network devices
            arp_output = subprocess.check_output(["arp", "-a"]).decode("utf-8")
            lines = arp_output.split("\n")
            
            for line in lines:
                if not line.strip():
                    continue
                    
                # Parse ARP output
                match = re.search(r"\((\d+\.\d+\.\d+\.\d+)\) at ([0-9a-f:]+)", line, re.IGNORECASE)
                if match:
                    ip = match.group(1)
                    mac = match.group(2)
                    
                    # Try to get hostname
                    try:
                        hostname = socket.gethostbyaddr(ip)[0]
                    except:
                        hostname = "Unknown"
                    
                    # Determine device type based on MAC address (simplified)
                    device_type = "Unknown"
                    if mac.startswith("00:0C:29") or mac.startswith("00:50:56") or mac.startswith("00:05:69"):
                        device_type = "Virtual Machine"
                    elif mac.startswith("00:1A:11") or mac.startswith("00:25:00"):
                        device_type = "Smartphone"
                    elif mac.startswith("B8:27:EB") or mac.startswith("DC:A6:32"):
                        device_type = "Raspberry Pi"
                    
                    devices.append({
                        "ip": ip,
                        "mac": mac,
                        "name": hostname,
                        "type": device_type,
                        "status": "Online"
                    })
                    
        elif os_name == "Windows":
            # For Windows, use the 'arp -a' command
            arp_output = subprocess.check_output(["arp", "-a"], shell=True).decode("utf-8")
            lines = arp_output.split("\n")
            
            for line in lines:
                if "dynamic" in line.lower():
                    parts = line.split()
                    if len(parts) >= 2:
                        ip = parts[0].strip()
                        mac = parts[1].strip()
                        
                        # Try to get hostname
                        try:
                            hostname = socket.gethostbyaddr(ip)[0]
                        except:
                            hostname = "Unknown"
                        
                        devices.append({
                            "ip": ip,
                            "mac": mac,
                            "name": hostname,
                            "type": "Unknown",
                            "status": "Online"
                        })
        
        # Additional scan using nmap if available (optional)
        try:
            nmap_output = subprocess.check_output(["nmap", "-sP", "192.168.1.0/24"], stderr=subprocess.DEVNULL).decode("utf-8")
            # Process nmap output if needed
        except:
            pass  # nmap not available or failed
            
    except Exception as e:
        print(f"Error during scan: {str(e)}", file=sys.stderr)
    
    return devices

def get_device_details(ip):
    """Get detailed information about a specific device."""
    device_info = {
        "ip": ip,
        "mac": "",
        "name": "Unknown",
        "type": "Unknown",
        "ports": [],
        "os": "Unknown",
        "status": "Unknown"
    }
    
    try:
        # Get MAC address
        if get_os() in ["Linux", "Darwin"]:
            arp_output = subprocess.check_output(["arp", "-n", ip]).decode("utf-8")
            mac_match = re.search(r"([0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2})", 
                                 arp_output, re.IGNORECASE)
            if mac_match:
                device_info["mac"] = mac_match.group(1)
        
        # Try to get hostname
        try:
            device_info["name"] = socket.gethostbyaddr(ip)[0]
        except:
            pass
        
        # Check if device is up
        ping_param = "-n" if get_os() == "Windows" else "-c"
        ping_output = subprocess.call(["ping", ping_param, "1", "-w", "1", ip], 
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        device_info["status"] = "Online" if ping_output == 0 else "Offline"
        
        # Try to determine OS (simplified)
        if device_info["status"] == "Online":
            try:
                ttl_output = subprocess.check_output(["ping", ping_param, "1", ip]).decode("utf-8")
                ttl_match = re.search(r"ttl=(\d+)", ttl_output, re.IGNORECASE)
                if ttl_match:
                    ttl = int(ttl_match.group(1))
                    if ttl <= 64:
                        device_info["os"] = "Linux/Unix"
                    elif ttl <= 128:
                        device_info["os"] = "Windows"
                    else:
                        device_info["os"] = "Network Equipment"
            except:
                pass
    
    except Exception as e:
        print(f"Error getting details for {ip}: {str(e)}", file=sys.stderr)
    
    return device_info

if __name__ == "__main__":
    # Simple command processing
    if len(sys.argv) < 2:
        print("Usage: python3 network_scanner.py [command] [parameters]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "scan":
        devices = scan_network_devices()
        print(json.dumps(devices))
    elif command == "device" and len(sys.argv) >= 3:
        ip_address = sys.argv[2]
        details = get_device_details(ip_address)
        print(json.dumps(details))
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
