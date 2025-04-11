
import { toast } from 'sonner';

// Interface for connection events
export interface ConnectionEvent {
  timestamp: Date;
  ssid: string;
  status: 'connected' | 'disconnected';
}

// Function to add a connection event to the history
export const addConnectionEvent = (event: ConnectionEvent) => {
  try {
    // Get existing history
    const historyString = localStorage.getItem('connection_history');
    const history: ConnectionEvent[] = historyString ? JSON.parse(historyString) : [];
    
    // Add new event
    history.push(event);
    
    // Limit history to last 20 entries
    if (history.length > 20) {
      history.shift();
    }
    
    // Save back to storage
    localStorage.setItem('connection_history', JSON.stringify(history));
    
    return true;
  } catch (err) {
    console.error('Error adding connection event:', err);
    return false;
  }
};

// Function to get connection history
export const getConnectionHistory = (): ConnectionEvent[] => {
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

// Calculate statistics on connection history
export const getConnectionStats = () => {
  const history = getConnectionHistory();
  
  if (history.length === 0) {
    return {
      totalConnections: 0,
      disconnections: 0,
      averageConnectionDuration: 0,
      lastConnection: null,
      lastDisconnection: null
    };
  }
  
  // Count connections and disconnections
  const connections = history.filter(event => event.status === 'connected');
  const disconnections = history.filter(event => event.status === 'disconnected');
  
  // Get the most recent events
  const sortedHistory = [...history].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  const lastConnection = connections.length > 0 ? 
    [...connections].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0] : 
    null;
    
  const lastDisconnection = disconnections.length > 0 ? 
    [...disconnections].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0] : 
    null;
  
  // Calculate average connection duration
  let totalDuration = 0;
  let durationCount = 0;
  
  // If we have pairs of connect/disconnect events, calculate durations
  if (connections.length > 0 && disconnections.length > 0) {
    // Create a map of SSIDs with their connection times
    const connectionTimes: Record<string, Date[]> = {};
    
    for (const conn of connections) {
      if (!connectionTimes[conn.ssid]) {
        connectionTimes[conn.ssid] = [];
      }
      connectionTimes[conn.ssid].push(conn.timestamp);
    }
    
    // For each disconnection, find the closest previous connection
    for (const disconn of disconnections) {
      if (connectionTimes[disconn.ssid] && connectionTimes[disconn.ssid].length > 0) {
        // Find the closest connection time before this disconnection
        const relevantConnections = connectionTimes[disconn.ssid].filter(
          time => time.getTime() < disconn.timestamp.getTime()
        );
        
        if (relevantConnections.length > 0) {
          const latestConnection = Math.max(...relevantConnections.map(d => d.getTime()));
          const duration = disconn.timestamp.getTime() - latestConnection;
          
          if (duration > 0) {
            totalDuration += duration;
            durationCount++;
          }
        }
      }
    }
  }
  
  const averageConnectionDuration = durationCount > 0 ? 
    totalDuration / durationCount / 1000 : // Convert to seconds
    0;
  
  return {
    totalConnections: connections.length,
    disconnections: disconnections.length,
    averageConnectionDuration: Math.round(averageConnectionDuration),
    lastConnection,
    lastDisconnection
  };
};

// Export a summary of the network connection stability
export const getNetworkStabilityRating = () => {
  const history = getConnectionHistory();
  const stats = getConnectionStats();
  
  if (history.length < 3) {
    return {
      rating: 'unknown',
      score: null,
      message: 'Not enough data to determine stability'
    };
  }
  
  // Calculate disconnections per hour
  const firstEvent = [...history].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  )[0];
  
  const timeSpanHours = (Date.now() - firstEvent.timestamp.getTime()) / (1000 * 60 * 60);
  const disconnectionsPerHour = stats.disconnections / Math.max(1, timeSpanHours);
  
  // Score from 0-100
  let score = 100;
  
  // Deduct points for frequent disconnections
  if (disconnectionsPerHour > 0) {
    score -= Math.min(50, disconnectionsPerHour * 10);
  }
  
  // Deduct points for short connection times
  if (stats.averageConnectionDuration < 300) { // Less than 5 minutes
    score -= Math.min(30, (300 - stats.averageConnectionDuration) / 10);
  }
  
  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  // Determine rating
  let rating: string;
  let message: string;
  
  if (score >= 90) {
    rating = 'excellent';
    message = 'Network connection is very stable';
  } else if (score >= 75) {
    rating = 'good';
    message = 'Network connection is stable';
  } else if (score >= 50) {
    rating = 'fair';
    message = 'Network connection has some stability issues';
  } else {
    rating = 'poor';
    message = 'Network connection is unstable';
  }
  
  return {
    rating,
    score: Math.round(score),
    message
  };
};
