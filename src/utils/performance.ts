
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
    // Return a no-op observer if not supported
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
      takeRecords: () => []
    } as IntersectionObserver;
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
