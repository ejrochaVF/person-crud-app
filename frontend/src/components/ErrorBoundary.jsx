/**
 * ERROR BOUNDARY COMPONENT
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 * the entire application.
 *
 * This is a React pattern for graceful error handling.
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="container">
          <div className="error-container">
            <h2>⚠️ Something went wrong</h2>
            <p>An unexpected error occurred in the application.</p>

            <details style={{ whiteSpace: 'pre-wrap', margin: '1rem 0' }}>
              <summary>Error Details (click to expand)</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>

            <div className="error-actions">
              <button
                className="btn btn-primary"
                onClick={this.handleRetry}
              >
                🔄 Try Again
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                🔄 Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;