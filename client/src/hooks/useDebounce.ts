import { useEffect, useState } from "react";

/**
 * Description placeholder
 * @export
 * @template T
 * @param {T} value
 * @param {number} [delay=700]
 * @returns {T}
 * @memberof useDebounce
 * @example
 * const debouncedValue = useDebounce(value, 700);
 */
export default function useDebounce<T>(value: T, delay = 700): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [value, delay]);

  return debouncedValue;
}
