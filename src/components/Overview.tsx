
import React from 'react';

const Overview: React.FC = () => {
  const networkData = {
    networkName: 'MyNetwork',
    localIp: '192.168.1.2',
    publicIp: '203.0.113.1',
    gatewayIp: '192.168.1.1',
    signalStrength: 'Good',
    connectedDevices: [
      { id: 1, ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:5E' },
      { id: 2, ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:5F' }
    ]
  };

  return (
    <div className="content-card">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      
      <div className="info-row">
        <div className="info-label">Wi-Fi Network Name:</div> 
        <div className="info-value">{networkData.networkName}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Local IP Address:</div>
        <div className="info-value">{networkData.localIp}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Public IP Address:</div>
        <div className="info-value">{networkData.publicIp}</div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Gateway IP Address:</div>
        <div className="info-value">
          <a href="#" className="link-color">{networkData.gatewayIp}</a>
        </div>
      </div>
      
      <div className="info-row">
        <div className="info-label">Signal Strength:</div>
        <div className="info-value">{networkData.signalStrength}</div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Connected Devices</h3>
        {networkData.connectedDevices.map((device) => (
          <div key={device.id} className="info-row">
            <div className="info-label">Device {device.id}:</div>
            <div className="info-value">IP {device.ip}, MAC {device.mac}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
