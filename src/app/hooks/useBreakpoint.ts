import { useEffect, useState } from "react";

export function useBreakpoint(
  breakpointWidth: number,
  defaultValue: boolean = false,
) {
  const [matches, setMatches] = useState(defaultValue);
  useEffect(() => {
    if (window) {
      const query = window.matchMedia(`(max-width: ${breakpointWidth}px)`);
      setMatches(query.matches);
    }
  }, [breakpointWidth]);
  return matches;
}
