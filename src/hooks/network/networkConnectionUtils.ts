
import { toast } from 'sonner';

// Function to connect to a WiFi network
export const connectToNetwork = async (ssid: string, password: string) => {
  try {
    toast.info(`Connecting to ${ssid}...`);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple password validation (in a real system, this would be done by the router)
    if (password.length < 8) {
      const errorMsg = `Failed to connect to ${ssid}: Invalid password (must be at least 8 characters)`;
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    // Success! Store the connection info for detection
    localStorage.setItem('last_connected_network', ssid);
    localStorage.setItem('connected_network_name', ssid);
    localStorage.setItem('current_browser_network', ssid);
    
    toast.success(`Connected to ${ssid}`);
    return { success: true, error: null };
  } catch (err) {
    console.error('Error connecting to network:', err);
    const errorMsg = `Failed to connect to ${ssid}: Network error`;
    toast.error(errorMsg);
    return { success: false, error: errorMsg };
  }
};

// Function to disconnect from current network
export const disconnectFromNetwork = async (currentNetworkName?: string) => {
  try {
    if (!currentNetworkName) {
      toast.error('Not connected to any network');
      return false;
    }
    
    toast.info(`Disconnecting from ${currentNetworkName}...`);
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear the stored network name
    localStorage.removeItem('last_connected_network');
    localStorage.removeItem('connected_network_name');
    localStorage.removeItem('current_browser_network');
    
    toast.success(`Disconnected from ${currentNetworkName}`);
    return true;
  } catch (err) {
    console.error('Error disconnecting from network:', err);
    toast.error('Failed to disconnect from network');
    return false;
  }
};
