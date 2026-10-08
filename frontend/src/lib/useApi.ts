import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from './api';

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion(v => v + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(null);
    apiFetch<T>(path, { signal: controller.signal }).then(setData).catch(err => {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Request failed');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [path, version]);
  return { data, error, loading, reload };
}
