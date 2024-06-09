import { MotionValue, useTransform } from "framer-motion";

export default function useFade(scrollYProgress: MotionValue<number>) {
  return useTransform(() => {
    const y = scrollYProgress.get();
    if (y < 0.05) {
      return "linear-gradient(to bottom, black calc(100% - 2rem), transparent 100%), linear-gradient(to left, black 17px, transparent 18px)"; // Just bottom fade
    } else if (y > 0.95) {
      return "linear-gradient(to top, black calc(100% - 5rem), transparent calc(100% - 2.2rem), black calc(100% - 2.2rem)), linear-gradient(to left, black 17px, transparent 18px)"; // Just top fade
    }
    return "linear-gradient(to bottom, black 0, black 2.2rem, transparent 2.2rem, black 5rem, black calc(100% - 2rem), transparent 100%), linear-gradient(to left, black 17px, transparent 18px)"; // Both faded
  });
}
