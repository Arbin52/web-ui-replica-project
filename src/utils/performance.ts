
/**
 * Utility functions to help with performance optimization
 */

// Debounce function to limit how often a function is called
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Throttle function with leading edge execution option
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number,
  options: { leading?: boolean } = { leading: true }
): ((...args: Parameters<F>) => void) => {
  let inThrottle = false;
  let lastArgs: Parameters<F> | null = null;
  
  return (...args: Parameters<F>): void => {
    // Store the latest args
    lastArgs = args;
    
    if (!inThrottle) {
      if (options.leading !== false) {
        func(...args);
      }
      
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        // Call with most recent args if they exist
        if (lastArgs && !options.leading) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    }
  };
};

// Uses the browser's requestIdleCallback if available, otherwise setTimeout
export const scheduleIdleTask = (
  callback: () => void,
  options = { timeout: 2000 }
): void => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
};

// Check if an element is in the viewport
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Setup IntersectionObserver to track elements in viewport
export const createViewportObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options = { rootMargin: '100px', threshold: 0.1 }
): IntersectionObserver => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Return a no-op observer if not supported, with proper type assertion
    const noopObserver = {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
      takeRecords: () => [],
      root: null,
      rootMargin: '0px',
      thresholds: [0]
    };
    return noopObserver as IntersectionObserver;
  }
  
  return new IntersectionObserver(callback, options);
};

// Detect if the browser is lagging
export const detectBrowserLag = (callback: (isLagging: boolean) => void): () => void => {
  let frameCount = 0;
  let lastFrameTime = performance.now();
  let lagDetected = false;
  let animFrameId: number;
  
  const checkFrame = () => {
    const now = performance.now();
    const delta = now - lastFrameTime;
    
    // If frame time is more than 50ms (less than 20fps), consider it lagging
    if (delta > 50 && !lagDetected) {
      lagDetected = true;
      callback(true);
    } else if (delta <= 50 && lagDetected) {
      lagDetected = false;
      callback(false);
    }
    
    frameCount++;
    lastFrameTime = now;
    animFrameId = requestAnimationFrame(checkFrame);
  };
  
  animFrameId = requestAnimationFrame(checkFrame);
  
  return () => cancelAnimationFrame(animFrameId);
};

// Optimize memory usage by cleaning up event listeners
export const cleanupEventListeners = (
  element: HTMLElement | Window | Document,
  events: Array<{ type: string; listener: EventListenerOrEventListenerObject }>
): void => {
  events.forEach(({ type, listener }) => {
    element.removeEventListener(type, listener);
  });
};

// Optimize React component rendering by skipping unnecessary renders
export const shouldComponentUpdate = (
  prevProps: Record<string, any>,
  nextProps: Record<string, any>,
  propKeys: string[]
): boolean => {
  return propKeys.some(key => prevProps[key] !== nextProps[key]);
};

// Delay navigation to prevent UI freezing
export const delayedNavigation = (
  navigationFn: () => void, 
  delay: number = 10
): void => {
  setTimeout(navigationFn, delay);
};

// Prevent rapid function execution
export const preventRapidExecution = <F extends (...args: any[]) => any>(
  func: F,
  cooldownMs: number = 200
): ((...args: Parameters<F>) => void) => {
  let lastExecution = 0;
  
  return (...args: Parameters<F>): void => {
    const now = Date.now();
    if (now - lastExecution >= cooldownMs) {
      lastExecution = now;
      func(...args);
    }
  };
};

// Break up long-running tasks
export const breakLongTask = <T>(
  items: T[],
  processFn: (item: T) => void,
  chunkSize: number = 5,
  delay: number = 0
): void => {
  let index = 0;
  
  const processChunk = () => {
    const limit = Math.min(index + chunkSize, items.length);
    
    while (index < limit) {
      processFn(items[index]);
      index++;
    }
    
    if (index < items.length) {
      setTimeout(processChunk, delay);
    }
  };
  
  processChunk();
};

// Detect if the current device is slow based on device memory and CPU cores
export const isSlowDevice = (): boolean => {
  // Check device memory (if available)
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
    return true;
  }
  
  // Check hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  // Check if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    return true;
  }
  
  return false;
};

// Adaptively adjust animations and effects based on device capabilities
export const adaptPerformanceSettings = (): {
  useAnimations: boolean;
  useShadows: boolean;
  useComplexLayouts: boolean;
  useBackgroundEffects: boolean;
} => {
  const isLowPerfDevice = isSlowDevice();
  
  return {
    useAnimations: !isLowPerfDevice,
    useShadows: !isLowPerfDevice,
    useComplexLayouts: !isLowPerfDevice,
    useBackgroundEffects: !isLowPerfDevice
  };
};

// Smart timeout that can detect if the device is slow and adjust accordingly
export const smartTimeout = (callback: () => void, defaultDelay: number): void => {
  const isLow = isSlowDevice();
  const adjustedDelay = isLow ? defaultDelay * 1.5 : defaultDelay;
  
  setTimeout(callback, adjustedDelay);
};
