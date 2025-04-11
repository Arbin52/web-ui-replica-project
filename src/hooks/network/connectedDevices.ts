
export const generateConnectedDevices = () => {
  // Based on a typical home network setup with real devices
  return [
    { id: 1, name: 'Windows PC', ip: '192.168.1.2', mac: '00:1B:44:11:3A:B7', type: 'Wired' },
    { id: 2, name: 'MacBook Pro', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E', type: 'Wireless' },
    { id: 3, name: 'iPhone 13', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F', type: 'Wireless' },
    { id: 4, name: 'Samsung Smart TV', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:60', type: 'Wireless' },
    { id: 5, name: 'Google Nest', ip: '192.168.1.6', mac: '00:1A:2B:3C:4D:61', type: 'Wireless' }
  ];
};
