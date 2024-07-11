import { useEffect, useRef, useState } from "react";

// Note: Intentionally does not handle window resize
export function useComponentSize(
  defaults: { width: number; height: number } = { width: 0, height: 0 },
) {
  const [size, setSize] = useState<{ width: number; height: number }>(defaults);
  const ref = useRef<any>();
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    if (rect.width !== size.width || rect.height !== size.height) {
      setSize({ width: rect.width, height: rect.height });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, ...size };
}
