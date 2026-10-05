"use client";
import { useState, useEffect, useRef } from "react";

export default function useHideOnScroll({ threshold = 10 } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const diff = y - lastY.current;

      if (Math.abs(diff) < threshold) return;

      if (y <= 80) {
        // always show near the top of the page
        setHidden(false);
      } else if (diff > 0) {
        // scrolling down
        setHidden(true);
      } else {
        // scrolling up
        setHidden(false);
      }

      lastY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}