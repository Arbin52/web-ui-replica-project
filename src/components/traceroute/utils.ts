
export const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

export const generateGeoLocation = () => {
  const countries = ['United States', 'Germany', 'Japan', 'United Kingdom', 'Canada', 'France', 'Australia'];
  const cities = {
    'United States': ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Miami'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Fukuoka', 'Sapporo'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  };
  
  const country = countries[Math.floor(Math.random() * countries.length)];
  const citiesForCountry = cities[country as keyof typeof cities];
  const city = citiesForCountry[Math.floor(Math.random() * citiesForCountry.length)];
  
  const latitude = (Math.random() * 180 - 90).toFixed(4);
  const longitude = (Math.random() * 360 - 180).toFixed(4);
  const isp = generateRandomISP();
  const asn = `AS${Math.floor(Math.random() * 65000) + 1000}`;
  
  return { country, city, latitude, longitude, isp, asn };
};

export const generateRandomISP = () => {
  const isps = [
    'Comcast', 'AT&T', 'Verizon', 'Deutsche Telekom', 'NTT Communications', 
    'British Telecom', 'Rogers Communications', 'Orange', 'Telstra', 'Level3',
    'Cloudflare', 'Google', 'Microsoft', 'Amazon AWS', 'Akamai'
  ];
  return isps[Math.floor(Math.random() * isps.length)];
};

export const calculateJitter = (times: (number | null)[]) => {
  const validTimes = times.filter(t => t !== null) as number[];
  if (validTimes.length <= 1) return 0;
  
  let jitterSum = 0;
  for (let i = 1; i < validTimes.length; i++) {
    jitterSum += Math.abs(validTimes[i] - validTimes[i-1]);
  }
  return (jitterSum / (validTimes.length - 1)).toFixed(2);
};

export const calculatePacketLoss = (times: (number | null)[]) => {
  const nullCount = times.filter(t => t === null).length;
  return Math.round((nullCount / times.length) * 100);
};

export const exportToCSV = (results: any[]) => {
  // Convert object array to CSV string
  const csvRows: string[] = [];
  const headers = Object.keys(results[0]);
  csvRows.push(headers.join(','));
  
  for (const row of results) {
    const values = headers.map(header => {
      const val = row[header];
      return `"${val !== null && val !== undefined ? String(val).replace(/"/g, '""') : ''}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

export const exportToJSON = (results: any[]) => {
  return JSON.stringify(results, null, 2);
};

