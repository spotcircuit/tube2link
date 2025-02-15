'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface State {
  readonly hasError: boolean;
  readonly error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-white/80">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
