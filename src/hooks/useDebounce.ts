import { useState, useEffect } from "react";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const debounceTimer = setTimeout(() => {
      setDebouncedValue(value);
      setLoading(false);
    }, delay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [value, delay]);

  return { debouncedValue, loading };
};

export default useDebounce;
