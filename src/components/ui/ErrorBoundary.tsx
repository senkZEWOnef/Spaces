'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Oops! Something went wrong</Alert.Heading>
            <p className="mb-3">
              We&apos;re sorry, but something unexpected happened. Our team has been notified.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-start">
                <summary style={{ cursor: 'pointer' }}>Error Details (Development)</summary>
                <pre className="mt-2 p-3 bg-light border rounded small">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}