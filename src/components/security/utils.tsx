
import React from 'react';

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'text-red-500 bg-red-50 border-red-200';
    case 'medium':
      return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'low':
      return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

export const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'network':
      return 'Wifi';
    case 'system':
      return 'Server';
    case 'access':
      return 'Lock';
    case 'configuration':
      return 'Settings';
    case 'port':
      return 'Shield';
    default:
      return 'Shield';
  }
};

export const getSecurityIcon = (status: string) => {
  if (status === 'active' || status === 'valid' || status === 'enabled' || status === 'Active' || status === 'Enabled') {
    return <span className="text-green-500">✓</span>;
  } else if (status === 'inactive' || status === 'invalid' || status === 'disabled' || status === 'Not Connected') {
    return <span className="text-red-500">✗</span>;
  } else {
    return null;
  }
};

export const getPortRiskLevel = (port: number): { risk: 'high' | 'medium' | 'low'; description: string } => {
  const highRiskPorts = [21, 22, 23, 25, 110, 135, 139, 445, 3389];
  const mediumRiskPorts = [20, 53, 111, 143, 161, 1433, 1434, 3306, 5432, 8080];
  
  if (highRiskPorts.includes(port)) {
    return { 
      risk: 'high', 
      description: 'This port is commonly targeted by attackers and should be closed if not needed.'
    };
  } else if (mediumRiskPorts.includes(port)) {
    return { 
      risk: 'medium', 
      description: 'This port may expose services that should be secured properly.'
    };
  } else {
    return { 
      risk: 'low', 
      description: 'This port is less commonly targeted but should still be monitored.'
    };
  }
};

export const getCommonPortService = (port: number): string => {
  const portServices: Record<number, string> = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    135: 'RPC',
    139: 'NetBIOS',
    143: 'IMAP',
    161: 'SNMP',
    443: 'HTTPS',
    445: 'SMB',
    1433: 'SQL Server',
    1434: 'SQL Browser',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    8080: 'HTTP Proxy'
  };
  
  return portServices[port] || 'Unknown';
};

