import useResizeObserver from "@react-hook/resize-observer";
import React from "react";

const useSize = <T extends Element>(target: React.RefObject<T>) => {
  const [size, setSize] = React.useState<DOMRectReadOnly>();

  React.useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

export default useSize;
