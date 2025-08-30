import React, { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, ...dependencies]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute };
}