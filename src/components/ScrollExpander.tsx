'use client'
import { useEffect, useRef, } from "react";

interface ScrollExpanderProps {
  domId: string;
  maxHeight?: number; // e.g., 300
  incrementAmount?: number; // amount of height increase per scroll
}

export default function ScrollExpander({ domId, maxHeight = 300, incrementAmount = 10 }: ScrollExpanderProps) {
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById(domId);
      if (!container) return;

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (isScrollingDown) {
        const currentHeight = container.offsetHeight;
        if (currentHeight < maxHeight) {
          container.style.height = `${Math.min(currentHeight + incrementAmount, maxHeight)}px`;
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [domId, maxHeight, incrementAmount]);

  return null;
}
