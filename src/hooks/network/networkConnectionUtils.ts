
import { toast } from 'sonner';

// Function to connect to a WiFi network
export const connectToNetwork = async (ssid: string, password: string) => {
  try {
    // For auto-connection, we'll bypass validation
    const isAutoConnect = password === "";
    
    if (!isAutoConnect) {
      toast.info(`Connecting to ${ssid}...`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple password validation (in a real system, this would be done by the router)
      if (password.length < 8) {
        const errorMsg = `Failed to connect to ${ssid}: Invalid password (must be at least 8 characters)`;
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } else {
      console.log(`Auto-connecting to ${ssid}...`);
    }
    
    // Success! Store the connection info for detection
    localStorage.setItem('last_connected_network', ssid);
    localStorage.setItem('connected_network_name', ssid);
    localStorage.setItem('current_browser_network', ssid);
    
    // Store connection timestamp
    const connectionEvent = {
      timestamp: new Date(),
      ssid,
      status: 'connected'
    };
    
    // Store connection history
    const historyString = localStorage.getItem('connection_history');
    const history = historyString ? JSON.parse(historyString) : [];
    history.push(connectionEvent);
    
    // Limit history to last 20 entries
    if (history.length > 20) {
      history.shift();
    }
    
    localStorage.setItem('connection_history', JSON.stringify(history));
    
    if (!isAutoConnect) {
      toast.success(`Connected to ${ssid}`);
    }
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
    
    // Store disconnection event
    const disconnectEvent = {
      timestamp: new Date(),
      ssid: currentNetworkName,
      status: 'disconnected'
    };
    
    // Update connection history
    const historyString = localStorage.getItem('connection_history');
    const history = historyString ? JSON.parse(historyString) : [];
    history.push(disconnectEvent);
    
    // Limit history to last 20 entries
    if (history.length > 20) {
      history.shift();
    }
    
    localStorage.setItem('connection_history', JSON.stringify(history));
    
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

// Function to get connection history
export const getConnectionHistory = () => {
  const historyString = localStorage.getItem('connection_history');
  if (!historyString) return [];
  
  try {
    const history = JSON.parse(historyString);
    // Convert string timestamps to Date objects
    return history.map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestamp)
    }));
  } catch (err) {
    console.error('Error parsing connection history:', err);
    return [];
  }
};

// Function to clear connection history
export const clearConnectionHistory = () => {
  localStorage.removeItem('connection_history');
  toast.info('Connection history cleared');
  return true;
};

// Function to check if the device is currently connected to a network
export const isDeviceConnected = () => {
  return navigator.onLine;
};

// Function to get current network SSID
export const getCurrentNetworkName = () => {
  // Try multiple potential sources for the network name
  const userProvidedName = localStorage.getItem('user_provided_network_name');
  const detectedName = localStorage.getItem('webrtc_detected_ssid');
  const browserNetwork = localStorage.getItem('current_browser_network');
  const connectedNetwork = localStorage.getItem('connected_network_name');
  const lastConnected = localStorage.getItem('last_connected_network');
  
  // Return the first available network name
  return userProvidedName || detectedName || browserNetwork || connectedNetwork || lastConnected;
};
