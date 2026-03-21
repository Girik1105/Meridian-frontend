"use client";

import { useState, useEffect, useRef } from "react";

interface UseTypingEffectOptions {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function useTypingEffect({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 60,
  pauseDuration = 2000,
}: UseTypingEffectOptions) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion.current) {
      setDisplayText(phrases[0]);
      setIsTyping(false);
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        setDisplayText(currentPhrase.slice(0, charIndex));
        setIsTyping(true);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setIsTyping(false);
          timeoutId = setTimeout(tick, pauseDuration);
          return;
        }
        timeoutId = setTimeout(tick, typingSpeed);
      } else {
        charIndex--;
        setDisplayText(currentPhrase.slice(0, charIndex));
        setIsTyping(true);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeoutId = setTimeout(tick, typingSpeed);
          return;
        }
        timeoutId = setTimeout(tick, deletingSpeed);
      }
    }

    timeoutId = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return { displayText, isTyping };
}
