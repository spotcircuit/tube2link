'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <h2 className="text-lg font-semibold text-red-200 mb-2">Something went wrong</h2>
          <details className="text-red-200 whitespace-pre-wrap">
            <summary className="cursor-pointer mb-2">Click to see error details</summary>
            <pre className="text-sm font-mono bg-black/30 p-4 rounded mt-2 overflow-auto">
              {this.state.error?.toString()}
              {'\n\nComponent Stack:\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
