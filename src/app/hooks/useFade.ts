import { MotionValue, useTransform } from "framer-motion";

export default function useFade(scrollYProgress: MotionValue<number>) {
  return useTransform(() => {
    const y = scrollYProgress.get();
    if (y < 0.05) {
      return "linear-gradient(to bottom, black calc(100% - 3rem), transparent 100%), linear-gradient(to left, black 17px, transparent 18px)"; // Just bottom fade
    } else if (y > 0.95) {
      return "linear-gradient(to top, black calc(100% - 3rem), transparent 100%), linear-gradient(to left, black 17px, transparent 18px)"; // Just top fade
    }
    return "linear-gradient(to bottom, transparent 0%, black 3rem, black calc(100% - 3rem), transparent 100%), linear-gradient(to left, black 17px, transparent 18px)"; // Both faded
  });
}
