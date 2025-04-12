
#!/usr/bin/env python3
import json
import sys
import socket
import subprocess
import platform
import re
from datetime import datetime
import os
import time

try:
    import netifaces
    NETIFACES_AVAILABLE = True
except ImportError:
    NETIFACES_AVAILABLE = False
    print("netifaces module not available, some functionality will be limited", file=sys.stderr)

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False
    print("psutil module not available, some functionality will be limited", file=sys.stderr)

try:
    import nmap
    NMAP_AVAILABLE = True
except ImportError:
    NMAP_AVAILABLE = False
    print("python-nmap module not available, some functionality will be limited", file=sys.stderr)

try:
    from scapy.all import ARP, Ether, srp
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False
    print("scapy module not available, some functionality will be limited", file=sys.stderr)

# Manufacturer MAC prefixes (simplified)
MAC_PREFIXES = {
    "00:0C:29": "VMware",
    "00:50:56": "VMware",
    "00:05:69": "VMware",
    "00:1A:11": "Google",
    "00:25:00": "Apple",
    "B8:27:EB": "Raspberry Pi",
    "DC:A6:32": "Raspberry Pi",
    "3C:E0:72": "Apple",
    "A4:83:E7": "Apple",
    "68:D9:3C": "Apple",
    "8C:85:90": "Apple",
    "04:54:53": "Apple",
    "A8:5C:2C": "Apple",
    "3C:D0:F8": "Apple",
    "00:17:88": "Philips",
    "EC:FA:BC": "Xiaomi",
    "FC:EC:DA": "Amazon",
    "50:F1:4A": "Amazon",
    "F0:D2:F1": "Amazon",
    "04:D6:AA": "Samsung",
}

def get_os():
    """Detect the operating system."""
    return platform.system()

def get_default_gateway():
    """Get the default gateway IP address."""
    try:
        if NETIFACES_AVAILABLE:
            gateways = netifaces.gateways()
            if 'default' in gateways and netifaces.AF_INET in gateways['default']:
                return gateways['default'][netifaces.AF_INET][0]
    except Exception as e:
        print(f"Error getting default gateway: {str(e)}", file=sys.stderr)
    
    # Fallback methods
    try:
        os_type = get_os()
        if os_type == "Windows":
            output = subprocess.check_output("ipconfig", shell=True).decode("utf-8")
            for line in output.split('\n'):
                if "Default Gateway" in line:
                    match = re.search(r"(\d+\.\d+\.\d+\.\d+)", line)
                    if match:
                        return match.group(1)
        elif os_type in ["Linux", "Darwin"]:  # Linux or macOS
            output = subprocess.check_output("ip route | grep default", shell=True).decode("utf-8")
            match = re.search(r"default via (\d+\.\d+\.\d+\.\d+)", output)
            if match:
                return match.group(1)
    except Exception:
        pass
    
    # Default fallback
    return "192.168.1.1"

def get_network_range():
    """Get the local network range based on interface information."""
    gateway = get_default_gateway()
    # Default to a /24 network based on the gateway
    if gateway:
        network_prefix = ".".join(gateway.split(".")[:3])
        return f"{network_prefix}.0/24"
    return "192.168.1.0/24"

def get_manufacturer(mac_address):
    """Get the manufacturer name based on MAC address prefix."""
    if not mac_address:
        return "Unknown"
        
    mac_upper = mac_address.upper()
    # Try different prefix lengths
    for prefix_len in [8, 7, 6]:
        prefix = mac_upper[:prefix_len]
        for known_prefix, manufacturer in MAC_PREFIXES.items():
            if known_prefix.upper()[:prefix_len] == prefix:
                return manufacturer
    
    return "Unknown"

def get_likely_device_type(hostname, mac_manufacturer):
    """Determine the likely device type based on hostname and manufacturer."""
    hostname_lower = hostname.lower() if hostname else ""
    
    # Mobile devices
    if any(keyword in hostname_lower for keyword in ["iphone", "android", "mobile", "phone"]) or \
       mac_manufacturer in ["Apple", "Samsung", "Google", "Xiaomi", "OnePlus", "Huawei"]:
        return "smartphone"
    
    # IoT devices
    if any(keyword in hostname_lower for keyword in ["echo", "alexa", "dot", "smart", "nest", "cam"]) or \
       mac_manufacturer in ["Amazon", "Philips", "Nest"]:
        return "iot"
       
    # Computers
    if any(keyword in hostname_lower for keyword in ["pc", "desktop", "laptop", "macbook", "imac"]):
        return "computer"
    
    # TVs and entertainment
    if any(keyword in hostname_lower for keyword in ["tv", "roku", "firetv", "appletv", "chromecast"]):
        return "entertainment"
        
    # Raspberry Pi
    if "pi" in hostname_lower or mac_manufacturer == "Raspberry Pi":
        return "computer"
        
    # Default by manufacturer
    if mac_manufacturer == "Apple":
        return "computer"
    
    return "unknown"

def scan_network_devices_scapy():
    """Scan the network using Scapy (more accurate)."""
    try:
        network_range = get_network_range()
        print(f"Scanning network range: {network_range}", file=sys.stderr)
        
        # Create ARP request
        arp = ARP(pdst=network_range)
        ether = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether/arp

        # Send packet and get response
        result = srp(packet, timeout=3, verbose=0)[0]
        
        devices = []
        
        for sent, received in result:
            ip = received.psrc
            mac = received.hwsrc
            
            # Try to resolve hostname
            try:
                hostname = socket.gethostbyaddr(ip)[0]
            except:
                hostname = f"Device-{len(devices)+1}"
                
            manufacturer = get_manufacturer(mac)
            device_type = get_likely_device_type(hostname, manufacturer)
            
            devices.append({
                "id": f"dev-{len(devices)+1}",
                "ip": ip,
                "mac": mac,
                "name": hostname,
                "type": device_type,
                "manufacturer": manufacturer,
                "status": "Online"
            })
        
        return devices
    except Exception as e:
        print(f"Scapy scan error: {str(e)}", file=sys.stderr)
        return []

def scan_network_devices():
    """Scan for devices on the network and return a list of them."""
    # Try Scapy method first if available
    if SCAPY_AVAILABLE:
        print("Using Scapy for network scan", file=sys.stderr)
        devices = scan_network_devices_scapy()
        if devices:
            return devices
    
    # Fallback to system commands
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
                        hostname = f"Device-{len(devices)+1}"
                    
                    # Get manufacturer
                    manufacturer = get_manufacturer(mac)
                    
                    # Determine device type based on hostname and manufacturer
                    device_type = get_likely_device_type(hostname, manufacturer)
                    
                    devices.append({
                        "id": f"dev-{len(devices)+1}",
                        "ip": ip,
                        "mac": mac,
                        "name": hostname,
                        "type": device_type,
                        "manufacturer": manufacturer,
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
                            hostname = f"Device-{len(devices)+1}"
                        
                        # Get manufacturer
                        manufacturer = get_manufacturer(mac)
                        
                        # Determine device type based on hostname and manufacturer
                        device_type = get_likely_device_type(hostname, manufacturer)
                        
                        devices.append({
                            "id": f"dev-{len(devices)+1}",
                            "ip": ip,
                            "mac": mac,
                            "name": hostname,
                            "type": device_type,
                            "manufacturer": manufacturer,
                            "status": "Online"
                        })
        
        # Try to use nmap for additional scanning if available
        if NMAP_AVAILABLE and not devices:
            try:
                print("Trying nmap scan fallback", file=sys.stderr)
                nm = nmap.PortScanner()
                nm.scan(hosts=get_network_range(), arguments='-sn')
                
                for host in nm.all_hosts():
                    if 'mac' in nm[host]['addresses']:
                        mac = nm[host]['addresses']['mac']
                        ip = host
                        
                        # Try to get hostname
                        try:
                            hostname = socket.gethostbyaddr(ip)[0]
                        except:
                            hostname = nm[host].get('hostnames', [{'name': f"Device-{len(devices)+1}"}])[0]['name']
                        
                        # Get manufacturer
                        manufacturer = nm[host].get('vendor', {}).get(mac, get_manufacturer(mac))
                        
                        # Determine device type
                        device_type = get_likely_device_type(hostname, manufacturer)
                        
                        devices.append({
                            "id": f"dev-{len(devices)+1}",
                            "ip": ip,
                            "mac": mac,
                            "name": hostname,
                            "type": device_type,
                            "manufacturer": manufacturer,
                            "status": "Online"
                        })
                    else:
                        # Device without MAC, probably just has IP
                        ip = host
                        devices.append({
                            "id": f"dev-{len(devices)+1}",
                            "ip": ip,
                            "mac": "Unknown",
                            "name": f"Device-{len(devices)+1}",
                            "type": "unknown", 
                            "manufacturer": "Unknown",
                            "status": "Online"
                        })
            except Exception as e:
                print(f"Nmap scan failed: {str(e)}", file=sys.stderr)
            
    except Exception as e:
        print(f"Error during scan: {str(e)}", file=sys.stderr)
    
    return devices

def get_device_details(ip):
    """Get detailed information about a specific device."""
    device_info = {
        "id": f"dev-{ip.replace('.', '')}",
        "ip": ip,
        "mac": "",
        "name": "Unknown",
        "type": "unknown",
        "ports": [],
        "os": "Unknown",
        "status": "Unknown",
        "manufacturer": "Unknown",
        "lastSeen": datetime.now().isoformat()
    }
    
    try:
        # Get MAC address
        if get_os() in ["Linux", "Darwin"]:
            try:
                arp_output = subprocess.check_output(["arp", "-n", ip]).decode("utf-8")
                mac_match = re.search(r"([0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2}:[0-9a-f]{1,2})", 
                                     arp_output, re.IGNORECASE)
                if mac_match:
                    device_info["mac"] = mac_match.group(1)
                    device_info["manufacturer"] = get_manufacturer(device_info["mac"])
            except:
                pass
        elif get_os() == "Windows":
            try:
                arp_output = subprocess.check_output(["arp", "-a", ip], shell=True).decode("utf-8")
                mac_match = re.search(r"([0-9a-f]{1,2}-[0-9a-f]{1,2}-[0-9a-f]{1,2}-[0-9a-f]{1,2}-[0-9a-f]{1,2}-[0-9a-f]{1,2})", 
                                     arp_output, re.IGNORECASE)
                if mac_match:
                    mac = mac_match.group(1).replace("-", ":")
                    device_info["mac"] = mac
                    device_info["manufacturer"] = get_manufacturer(mac)
            except:
                pass
        
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
        
        # Try to determine device type based on hostname and manufacturer
        device_info["type"] = get_likely_device_type(device_info["name"], device_info["manufacturer"])
        
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
            
            # Use nmap for more detailed OS detection if available
            if NMAP_AVAILABLE:
                try:
                    nm = nmap.PortScanner()
                    nm.scan(hosts=ip, arguments='-O')
                    
                    if ip in nm and 'osmatch' in nm[ip]:
                        if nm[ip]['osmatch'] and len(nm[ip]['osmatch']) > 0:
                            device_info["os"] = nm[ip]['osmatch'][0]['name']
                            
                    # Get open ports
                    if ip in nm and 'tcp' in nm[ip]:
                        for port in nm[ip]['tcp']:
                            if nm[ip]['tcp'][port]['state'] == 'open':
                                device_info["ports"].append({
                                    "port": port,
                                    "service": nm[ip]['tcp'][port]['name']
                                })
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
    elif command == "status":
        available_modules = {
            "scapy": SCAPY_AVAILABLE,
            "nmap": NMAP_AVAILABLE,
            "netifaces": NETIFACES_AVAILABLE,
            "psutil": PSUTIL_AVAILABLE
        }
        print(json.dumps({
            "os": get_os(),
            "python_version": platform.python_version(),
            "modules": available_modules,
            "default_gateway": get_default_gateway(),
            "network_range": get_network_range()
        }))
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
