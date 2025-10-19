import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error | null;
  errorId: string;
  resetError: () => void;
}

/**
 * Enterprise-grade error boundary with comprehensive error handling
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary Caught Error [${this.state.errorId}]`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
  }

  private logErrorToService = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      const errorData = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        buildVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
      };

      // Send to your error tracking service
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error}
            errorId={this.state.errorId}
            resetError={this.handleReset}
          />
        );
      }

      // Default error fallback UI
      return <DefaultErrorFallback 
        error={this.state.error}
        errorId={this.state.errorId}
        resetError={this.handleReset}
      />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error, errorId, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry! An unexpected error occurred. Our team has been notified and will look into this issue.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">Error Details:</p>
            <p className="text-xs text-gray-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 mb-6 font-mono">
          Error ID: {errorId}
        </div>

        <div className="space-y-3">
          <Button 
            onClick={resetError}
            className="w-full"
            intent="primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
            intent="secondary"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>

          {process.env.NODE_ENV === 'development' && (
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
              intent="secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support with the error ID above.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Specialized error boundary for async operations
 */
export function AsyncErrorBoundary({ children, onError }: ErrorBoundaryProps) {
  return (
    <ErrorBoundary 
      onError={onError}
      fallback={AsyncErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
}

function AsyncErrorFallback({ error, errorId, resetError }: ErrorFallbackProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center mb-4">
        <Bug className="w-5 h-5 text-red-600 mr-2" />
        <h3 className="text-lg font-medium text-red-900">Operation Failed</h3>
      </div>
      
      <p className="text-red-700 mb-4">
        An error occurred while processing your request. Please try again.
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-4 text-sm">
          <summary className="cursor-pointer text-red-800 font-medium">
            Error Details
          </summary>
          <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}

      <div className="flex gap-2">
        <Button onClick={resetError} size="sm" intent="primary">
          <RefreshCw className="w-4 h-4 mr-1" />
          Retry
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          size="sm" 
          intent="secondary"
        >
          Refresh Page
        </Button>
      </div>
      
      <p className="text-xs text-red-600 mt-2 font-mono">ID: {errorId}</p>
    </div>
  );
}

/**
 * Hook for handling async errors in components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Async error caught:', error);
    setError(error);
  }, []);

  // Throw error to be caught by error boundary
  if (error) {
    throw error;
  }

  return { handleError, resetError };
}