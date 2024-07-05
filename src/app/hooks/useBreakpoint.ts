export function useBreakpoint(
  breakpointWidth: number,
  defaultValue: boolean = false,
) {
  if (window) {
    const query = window.matchMedia(`(max-width: ${breakpointWidth}px)`);
    return query.matches;
  }
  return defaultValue;
}
