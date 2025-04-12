
import { useState } from 'react';

export const useConnectionErrorHandling = () => {
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const clearConnectionError = () => {
    setConnectionError(null);
  };

  return {
    connectionError,
    setConnectionError,
    clearConnectionError
  };
};
