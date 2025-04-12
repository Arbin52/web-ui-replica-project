
import { toast } from 'sonner';
import { 
  connectNewDevice, 
  disconnectDevice, 
  getConnectedDeviceStatus, 
  updateDeviceStatus 
} from '../connectedDevices';

export const useDeviceActions = (fetchNetworkStatus: () => Promise<void>) => {
  const simulateDeviceConnect = async () => {
    const newCount = connectNewDevice();
    toast.info(`New device connected to network (${newCount} devices total)`);
    await fetchNetworkStatus();
    return true;
  };
  
  const simulateDeviceDisconnect = async () => {
    const newCount = disconnectDevice();
    toast.info(`Device disconnected from network (${newCount} devices remaining)`);
    await fetchNetworkStatus();
    return true;
  };

  const getDeviceStatus = () => {
    return getConnectedDeviceStatus();
  };

  const setDeviceStatus = (deviceId: number, status: 'Online' | 'Offline') => {
    const updated = updateDeviceStatus(deviceId, status);
    if (updated) {
      fetchNetworkStatus();
    }
    return updated;
  };

  return {
    simulateDeviceConnect,
    simulateDeviceDisconnect,
    getDeviceStatus,
    setDeviceStatus
  };
};
