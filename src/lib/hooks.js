import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';

/** Wraps an async call with loading / error / data state. Stale responses are dropped. */
export function useAction(fn) {
  const [state, set] = useState({ loading: false, error: null, result: null });
  const seq = useRef(0);
  const run = useCallback(async (...args) => {
    const id = ++seq.current;
    set((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = await fn(...args);
      if (id === seq.current) set({ loading: false, error: null, result });
      return result;
    } catch (e) {
      if (id === seq.current) set((s) => ({ ...s, loading: false, error: e.message }));
      return null;
    }
  }, [fn]);
  const reset = useCallback(() => set({ loading: false, error: null, result: null }), []);
  return { ...state, run, reset };
}

/** Polls /api/metrics. */
export function useMetrics(interval = 5000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let alive = true;
    const tick = () => api.metrics().then((d) => alive && (setData(d), setError(null))).catch((e) => alive && setError(e.message));
    tick();
    const t = setInterval(tick, interval);
    return () => { alive = false; clearInterval(t); };
  }, [interval]);
  return { data, error };
}

let healthPromise;
export function useHealth() {
  const [health, setHealth] = useState(null);
  useEffect(() => {
    healthPromise ??= api.health().catch(() => ({ ok: false, mode: 'offline' }));
    healthPromise.then(setHealth);
  }, []);
  return health;
}
