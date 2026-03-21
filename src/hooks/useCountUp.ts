"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "./useScrollAnimation";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function useCountUp({
  end,
  duration = 2000,
  suffix = "",
}: UseCountUpOptions) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let startTime: number | null = null;
    let frameId: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = prefersReducedMotion
        ? 1
        : Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      setCount(Math.round(easedProgress * end));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, end, duration]);

  return { ref, count: `${count}${suffix}` };
}
