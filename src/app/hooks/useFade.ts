import { MotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const FADE_SIZE = 1;

export default function useFade(
  scrollYProgress: MotionValue<number>,
  headerHeight: number = 0, // in rem
) {
  const [leaveScrollbarRoom, setLeaveScrollbarRoom] = useState(true);
  useEffect(() => {
    // Likely a tablet/phone
    if (window && window.innerWidth < 768) {
      setLeaveScrollbarRoom(false);
    }
  }, []);

  return useTransform(() => {
    const y = scrollYProgress.get();
    let verticalGradient;
    if (y < 0.05) {
      verticalGradient = `linear-gradient(to bottom, black calc(100% - ${FADE_SIZE}rem), transparent 100%)`; // Just bottom fade
    } else if (y > 0.9) {
      verticalGradient = `linear-gradient(to top, black calc(100% - ${FADE_SIZE + headerHeight}rem), transparent calc(100% - ${headerHeight}rem), black calc(100% - ${headerHeight}rem))`; // Just top fade
    } else {
      verticalGradient = `linear-gradient(to bottom, black 0, black ${headerHeight}rem, transparent ${headerHeight}rem, black 5rem, black calc(100% - ${FADE_SIZE}rem), transparent 100%)`; // Both faded
    }

    if (leaveScrollbarRoom) {
      return `${verticalGradient}, linear-gradient(to left, black 17px, transparent 18px)`;
    }
    return verticalGradient;
  });
}
