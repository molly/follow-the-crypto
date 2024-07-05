import { useComponentSize } from "./useComponentSize";

export function useComponentBreakpoint(breakpointWidth: number) {
  const { ref, width } = useComponentSize();
  return { ref, isSmall: width < breakpointWidth };
}
