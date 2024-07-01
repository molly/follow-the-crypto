import useResizeObserver from "@react-hook/resize-observer";
import { useLayoutEffect, useState } from "react";

const useSize = <T extends Element>(target: React.RefObject<T>) => {
  const [size, setSize] = useState<DOMRectReadOnly>();

  useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

export default useSize;
