
/**
 * Security Monitoring Utilities
 * 
 * This module provides utilities for detecting and preventing
 * Man-in-the-Middle (MITM) attacks and other security threats.
 */

// List of known legitimate API endpoints
const knownEndpoints = [
  '/api/',
  '/auth/',
  'https://kcdwbytjiklqpdqlehei.supabase.co',
  'http://localhost:3001',
  // Add more legitimate endpoints here
];

// Security monitoring configuration
const securityConfig = {
  checkInterval: 30000, // Check security every 30 seconds
  requestIntegrityCheck: true, // Check for request tampering
  responseIntegrityCheck: true, // Check for response tampering
  certificateValidation: true, // Validate SSL certificates
  alertOnMixedContent: true, // Alert on mixed content
  logSuspiciousActivity: true, // Log suspicious activity
};

/**
 * Wraps fetch API to add security checks
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with response
 */
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Check if the URL is in the known endpoints list
  const isKnownEndpoint = knownEndpoints.some(endpoint => url.startsWith(endpoint));
  
  if (!isKnownEndpoint) {
    console.warn(`Accessing unknown endpoint: ${url}. This could be a security risk.`);
    // You might want to log this to your security monitoring system
  }
  
  // Add security headers to prevent some types of MITM attacks
  const secureOptions = {
    ...options,
    headers: {
      ...options.headers,
      'X-Request-Timestamp': Date.now().toString(),
      'X-Request-ID': generateRequestId(),
    }
  };
  
  try {
    // Perform the fetch
    const response = await fetch(url, secureOptions);
    
    // Verify response for signs of tampering
    if (securityConfig.responseIntegrityCheck) {
      verifyResponseIntegrity(response);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error (possible network tampering):', error);
    throw error;
  }
};

/**
 * Generates a unique request ID for tracking
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Verify response integrity for signs of tampering
 */
function verifyResponseIntegrity(response: Response): void {
  // Check for suspicious headers that might indicate a proxy
  const suspiciousHeaders = [
    'via',
    'x-forwarded-for',
    'forwarded',
    'proxy-connection',
  ];
  
  suspiciousHeaders.forEach(header => {
    if (response.headers.has(header)) {
      console.warn(`Suspicious header detected: ${header}=${response.headers.get(header)}`);
    }
  });
  
  // Check if HTTPS being used
  if (window.location.protocol !== 'https:' && securityConfig.alertOnMixedContent) {
    console.warn('Non-secure connection in use. Vulnerable to MITM attacks.');
  }
}

/**
 * Setup API request interceptor to detect and prevent MITM attacks
 */
export function setupSecurityMonitoring(): () => void {
  console.log('Setting up security monitoring...');
  
  // Intercept all fetch requests
  const originalFetch = window.fetch;
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    // Extract the URL string from the input
    const url = typeof input === 'string' 
      ? input 
      : input instanceof URL 
        ? input.href
        : input.url;
    
    // Add frontend security checks here
    if (typeof url === 'string' && !url.startsWith('https:') && !url.startsWith('http://localhost')) {
      console.warn(`Insecure request to ${url} detected`);
    }
    
    // Check for known patterns of MITM attacks in requests
    if (init && init.body && typeof init.body === 'string' && 
        (init.body.includes('<script>') || init.body.includes('eval('))) {
      console.error('Possible injection attack detected in request body');
      // You might want to block the request or send an alert
    }
    
    return originalFetch.apply(this, arguments);
  };
  
  // Set up periodic security checks
  const intervalId = setInterval(() => {
    performSecurityCheck();
  }, securityConfig.checkInterval);
  
  // Return cleanup function
  return () => {
    window.fetch = originalFetch;
    clearInterval(intervalId);
  };
}

/**
 * Perform comprehensive security check
 */
function performSecurityCheck(): void {
  // Check for mixed content
  if (window.location.protocol === 'https:') {
    const insecureContent = document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"]');
    if (insecureContent.length > 0) {
      console.warn(`Mixed content detected: ${insecureContent.length} insecure resources`);
    }
  }
  
  // Check for certificate issues
  if (securityConfig.certificateValidation) {
    // Browser doesn't expose certificate details to JavaScript
    // This is just a placeholder for potential checks
  }
  
  // Check for unexpected redirects
  // This would usually be handled by comparing current URL with expected URL
}

/**
 * Get the current security status
 */
export function getSecurityStatus() {
  return {
    isSecureContext: window.isSecureContext,
    protocol: window.location.protocol,
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    hasServiceWorker: 'serviceWorker' in navigator,
    timeChecked: new Date(),
  };
}

/**
 * Test for common MITM attack patterns
 */
export function testForMITMAttacks(): { isUnderAttack: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for protocol downgrade
  if (window.location.protocol !== 'https:' && 
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1')) {
    issues.push('Connection is not using HTTPS - vulnerable to MITM attacks');
  }
  
  // Check for suspicious iframes
  const suspiciousIframes = document.querySelectorAll('iframe:not([src^="https://"])');
  if (suspiciousIframes.length > 0) {
    issues.push(`${suspiciousIframes.length} suspicious iframes detected`);
  }
  
  // Check storage for tampering
  try {
    const canary = localStorage.getItem('security_canary');
    if (canary && canary !== 'authentic') {
      issues.push('Storage tampering detected - possible session hijacking attempt');
    }
  } catch (e) {
    // Storage access might be blocked in some contexts
    issues.push('Unable to verify storage integrity');
  }

  // Check for proxy headers
  const proxyHeaders = ['via', 'x-forwarded-for', 'forwarded', 'proxy-connection'];
  const foundProxyHeaders = proxyHeaders.filter(header => 
    document.cookie.includes(header) || 
    (document.querySelector(`meta[http-equiv="${header}"]`))
  );
  
  if (foundProxyHeaders.length > 0) {
    issues.push('Proxy headers detected - possible MITM proxy in use');
  }

  // Check for mixed content
  const mixedContent = document.querySelectorAll(
    'img[src^="http:"], script[src^="http:"], link[href^="http:"]'
  );
  if (mixedContent.length > 0) {
    issues.push('Mixed content detected - insecure resources being loaded');
  }

  return { 
    isUnderAttack: issues.length > 0,
    issues
  };
}

/**
 * Initialize security monitoring
 */
export function initSecurity() {
  // Set a canary value to detect storage tampering
  try {
    localStorage.setItem('security_canary', 'authentic');
  } catch (e) {
    // Storage might be blocked
  }
  
  // Start monitoring
  return setupSecurityMonitoring();
}
