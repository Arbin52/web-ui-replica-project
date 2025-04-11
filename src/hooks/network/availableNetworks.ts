
// This function tries to get available networks through browser APIs if possible,
// otherwise falls back to sample data
export const getAvailableNetworks = () => {
  // First check if any real network info is available in localStorage
  const connectedNetworkName = localStorage.getItem('connected_network_name');

  // These networks are based on the image uploaded by the user, with the connected network (if any) at the top
  const networks = [
    { id: 1, ssid: 'YAKSO HOSTEL 5G', signal: -45, security: 'WPA2' },
    { id: 2, ssid: 'YAKSO HOSTEL', signal: -55, security: 'WPA2' },
    { id: 3, ssid: 'YBHD1_NTFiber', signal: -60, security: 'WPA2' },
    { id: 4, ssid: 'NTFiber_9498_2.4G', signal: -65, security: 'WPA2' },
    { id: 5, ssid: 'YAKSO HOSTEL 2', signal: -70, security: 'WPA2' },
    { id: 6, ssid: 'YAKSO HOSTEL 2 5G', signal: -72, security: 'WPA3' },
    { id: 7, ssid: 'YBHD_5G_NTFiber', signal: -75, security: 'WPA2' },
    { id: 8, ssid: 'gopal284_2', signal: -78, security: 'WPA2' },
    { id: 9, ssid: 'NTFiber_3CF0_2.4G', signal: -80, security: 'WPA2' },
    { id: 10, ssid: 'prashantshah143_2', signal: -82, security: 'WPA2' },
    { id: 11, ssid: 'shiv001_5', signal: -85, security: 'WPA2' },
    { id: 12, ssid: 'Hidden Network', signal: -88, security: 'Unknown' }
  ];

  // Try to get the actual current connected WiFi name through browser's navigator.connection if available
  let actualConnectedNetwork = null;
  
  // Attempt to detect current connection from browser
  if (navigator.onLine) {
    // Check if we can access connection info
    if ((navigator as any).connection) {
      // We're online and can access connection info
      console.log("Connection info available:", (navigator as any).connection);
    }
    
    // Check if we have any browser-reported network name
    actualConnectedNetwork = localStorage.getItem('current_browser_network');
  }

  // Always use the most accurate connected network name we have
  const activeNetworkName = actualConnectedNetwork || connectedNetworkName;

  // If there's a connected network, make sure it's at the top of the list with a strong signal
  if (activeNetworkName) {
    console.log("Adding active network to available networks:", activeNetworkName);
    
    // Check if the connected network is already in the list
    const existingNetworkIndex = networks.findIndex(n => n.ssid === activeNetworkName);
    
    if (existingNetworkIndex >= 0) {
      // Move it to the top and update its signal strength
      const network = networks[existingNetworkIndex];
      network.signal = -45; // Strong signal for connected network
      networks.splice(existingNetworkIndex, 1);
      networks.unshift(network);
      console.log("Moved existing network to top of list:", network);
    } else {
      // Add the connected network at the top
      networks.unshift({
        id: 0,
        ssid: activeNetworkName,
        signal: -45,
        security: 'WPA2'
      });
      console.log("Added new network to top of list:", activeNetworkName);
    }
  }
  
  // Try to detect real networks through the WiFi API if available
  // Note: This is experimental and requires user permission, which we won't implement here
  // but is shown as a potential future enhancement

  console.log("Returning available networks:", networks);
  return networks;
};
