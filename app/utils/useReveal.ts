"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Vérifie si c'est un élément de navbar
    const isInNavbar = el.closest(".navbar, nav, header");
    if (isInNavbar) {
      requestAnimationFrame(() => {
        setVisible(true);
      });
      return;
    }

    // Seulement les éléments avec data-reveal sont animés
    if (!el.hasAttribute("data-reveal")) {
      requestAnimationFrame(() => {
        setVisible(true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              setVisible(true);
            });
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
