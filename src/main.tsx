
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';

// Simple fallback component for global errors
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center flex-col gap-4">
    <h1 className="text-2xl font-bold">Something went wrong</h1>
    <p className="text-gray-600">The application encountered an error</p>
    <button 
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => window.location.reload()}
    >
      Reload application
    </button>
  </div>
);

// Adding error boundary with logging
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Global error caught:", error);
        console.error("Component stack:", info.componentStack);
      }}
    >
      <App />
    </ErrorBoundary>
  );
}
