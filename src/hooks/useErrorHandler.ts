import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error('Error occurred:', error, { context });
    
    let message = 'Something went wrong. Please try again.';
    
    if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message);
    } else if (typeof error === 'string') {
      message = error;
    }
    
    // Handle specific error types
    if (error && typeof error === 'object' && 'code' in error) {
      const code = String(error.code);
      if (code === 'PGRST116') {
        message = 'No records found.';
      } else if (code === 'auth/user-not-found') {
        message = 'User not found. Please check your credentials.';
      } else if (code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }
    }
    
    setError({ message, type: 'error' });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setError({ message, type: 'info' });
  }, []);

  const showWarning = useCallback((message: string) => {
    setError({ message, type: 'warning' });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    showSuccess,
    showWarning,
    clearError,
  };
}