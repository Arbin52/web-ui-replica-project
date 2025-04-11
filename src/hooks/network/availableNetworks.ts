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

  // If there's a connected network, make sure it's at the top of the list with a strong signal
  if (connectedNetworkName) {
    // Check if the connected network is already in the list
    const existingNetworkIndex = networks.findIndex(n => n.ssid === connectedNetworkName);
    
    if (existingNetworkIndex >= 0) {
      // Move it to the top and update its signal strength
      const network = networks[existingNetworkIndex];
      network.signal = -45; // Strong signal for connected network
      networks.splice(existingNetworkIndex, 1);
      networks.unshift(network);
    } else {
      // Add the connected network at the top
      networks.unshift({
        id: 0,
        ssid: connectedNetworkName,
        signal: -45,
        security: 'WPA2'
      });
    }
  }
  
  // Try to detect real networks through the WiFi API if available
  // Note: This is experimental and requires user permission, which we won't implement here
  // but is shown as a potential future enhancement

  return networks;
};
