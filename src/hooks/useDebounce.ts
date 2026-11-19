import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce rapidly changing values such as search input strings.
 * Delays updating the debounced value until after delay milliseconds have passed
 * since the last time the value was modified.
 */
export function useDebounce<T>(value: T, delayMs: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
