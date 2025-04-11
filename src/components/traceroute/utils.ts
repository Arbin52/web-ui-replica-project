
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

export const analyzeHopPattern = (results: any[]) => {
  const patterns = [];
  let currentPattern = { type: '', startHop: 0, endHop: 0 };

  for (let i = 0; i < results.length; i++) {
    const hop = results[i];
    let patternType = '';
    
    if (hop.status === 'timeout') {
      patternType = 'timeout';
    } else {
      const avgTime = calculateAverageResponseTime([hop.responseTime1, hop.responseTime2, hop.responseTime3]);
      if (avgTime === null) {
        patternType = 'no_response';
      } else if (avgTime > 100) {
        patternType = 'high_latency';
      } else if (i > 0) {
        const prevHop = results[i-1];
        const prevAvgTime = calculateAverageResponseTime([prevHop.responseTime1, prevHop.responseTime2, prevHop.responseTime3]);
        if (prevAvgTime !== null && avgTime > prevAvgTime * 2) {
          patternType = 'latency_jump';
        } else {
          patternType = 'normal';
        }
      } else {
        patternType = 'normal';
      }
    }
    
    if (i === 0 || currentPattern.type !== patternType) {
      if (i > 0) {
        currentPattern.endHop = i - 1;
        patterns.push({...currentPattern});
      }
      currentPattern = { type: patternType, startHop: i, endHop: i };
    }
  }
  
  if (results.length > 0) {
    currentPattern.endHop = results.length - 1;
    patterns.push({...currentPattern});
  }
  
  return patterns;
};

export const calculateAverageResponseTime = (times: (number | null)[]) => {
  const validTimes = times.filter(t => t !== null) as number[];
  if (validTimes.length === 0) return null;
  return validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length;
};

export const calculateNetworkMetrics = (results: any[]) => {
  let totalHops = results.length;
  let timeoutHops = 0;
  let totalLatency = 0;
  let latencyPoints = 0;
  let maxLatency = 0;
  let maxLatencyHop = 0;
  
  for (let i = 0; i < results.length; i++) {
    const hop = results[i];
    if (hop.status === 'timeout') {
      timeoutHops++;
      continue;
    }
    
    const times = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null) as number[];
    if (times.length > 0) {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      totalLatency += avgTime;
      latencyPoints++;
      
      if (avgTime > maxLatency) {
        maxLatency = avgTime;
        maxLatencyHop = i;
      }
    }
  }
  
  const avgLatency = latencyPoints > 0 ? (totalLatency / latencyPoints).toFixed(2) : 'N/A';
  const timeoutPercentage = (timeoutHops / totalHops * 100).toFixed(1);
  
  return {
    totalHops,
    timeoutPercentage,
    avgLatency,
    maxLatency: maxLatency.toFixed(2),
    maxLatencyHop: results[maxLatencyHop]?.hop || 'N/A'
  };
};

export const classifyRoute = (results: any[]) => {
  if (results.length === 0) return 'Unknown';
  
  // Check final hop status
  const finalHop = results[results.length - 1];
  if (finalHop.status !== 'success') return 'Incomplete';
  
  // Calculate percentage of timeout hops
  const timeoutHops = results.filter(hop => hop.status === 'timeout').length;
  const timeoutPercentage = (timeoutHops / results.length) * 100;
  
  // Calculate average latency
  const validHops = results.filter(hop => hop.status === 'success');
  let totalLatency = 0;
  let count = 0;
  
  for (const hop of validHops) {
    const times = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null) as number[];
    if (times.length > 0) {
      totalLatency += times.reduce((sum, time) => sum + time, 0) / times.length;
      count++;
    }
  }
  
  const avgLatency = count > 0 ? totalLatency / count : 0;
  
  if (timeoutPercentage > 20) return 'Unstable';
  if (avgLatency > 100) return 'High Latency';
  if (avgLatency < 30 && results.length < 8) return 'Optimal';
  return 'Normal';
};

export const detectAnomalies = (results: any[]) => {
  const anomalies = [];
  
  // Check for timeouts
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === 'timeout') {
      anomalies.push({
        hop: results[i].hop,
        type: 'timeout',
        message: `Timeout detected at hop ${results[i].hop}`
      });
    }
  }
  
  // Check for latency spikes
  for (let i = 1; i < results.length; i++) {
    const prevHop = results[i-1];
    const currHop = results[i];
    
    const prevTimes = [prevHop.responseTime1, prevHop.responseTime2, prevHop.responseTime3].filter(t => t !== null) as number[];
    const currTimes = [currHop.responseTime1, currHop.responseTime2, currHop.responseTime3].filter(t => t !== null) as number[];
    
    if (prevTimes.length > 0 && currTimes.length > 0) {
      const prevAvg = prevTimes.reduce((sum, time) => sum + time, 0) / prevTimes.length;
      const currAvg = currTimes.reduce((sum, time) => sum + time, 0) / currTimes.length;
      
      if (currAvg > prevAvg * 3 && currAvg > 50) {
        anomalies.push({
          hop: currHop.hop,
          type: 'latency_spike',
          message: `Latency spike at hop ${currHop.hop} (${currAvg.toFixed(2)}ms vs ${prevAvg.toFixed(2)}ms)`
        });
      }
    }
  }
  
  // Check for high jitter
  for (let i = 0; i < results.length; i++) {
    const hop = results[i];
    const times = [hop.responseTime1, hop.responseTime2, hop.responseTime3].filter(t => t !== null) as number[];
    
    if (times.length > 1) {
      let maxDiff = 0;
      for (let j = 1; j < times.length; j++) {
        const diff = Math.abs(times[j] - times[j-1]);
        if (diff > maxDiff) maxDiff = diff;
      }
      
      if (maxDiff > 50) {
        anomalies.push({
          hop: hop.hop,
          type: 'high_jitter',
          message: `High jitter detected at hop ${hop.hop} (${maxDiff.toFixed(2)}ms variation)`
        });
      }
    }
  }
  
  return anomalies;
};
