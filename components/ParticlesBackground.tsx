/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    particlesJS: any;
  }
}

type ParticlesBackgroundProps = {
  mode?: "full" | "section";
};

export default function ParticlesBackground({
  mode = "full",
}: ParticlesBackgroundProps) {
  const style =
    mode === "full"
      ? {
          position: "fixed" as const,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          pointerEvents: "none" as const,
        }
      : {
          position: "absolute" as const,
          inset: 0,
          zIndex: 0,
          pointerEvents: "none" as const,
        };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 30; // 3s de retry

    const initParticles = () => {
      if (typeof window === "undefined") return;

      const hasLib = !!window.particlesJS;
      const canvasTarget = document.getElementById("particles-js-1");

      if (!hasLib || !canvasTarget) return;

      // Initialise les particules
      window.particlesJS("particles-js-1", {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.7,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.3,
              sync: false,
            },
          },
          size: {
            value: 4,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 1,
              sync: false,
            },
          },
          line_linked: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "bottom",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false, mode: "repulse" },
            onclick: { enable: false, mode: "push" },
            resize: true,
          },
        },
        retina_detect: true,
      });

      if (intervalId) clearInterval(intervalId);
    };

    // On tente tout de suite
    initParticles();

    // Si ce n’est pas prêt, on retry toutes les 100ms
    intervalId = setInterval(() => {
      attempts += 1;
      if (attempts > maxAttempts) {
        if (intervalId) clearInterval(intervalId);
        return;
      }
      initParticles();
    }, 100);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mode]);

  return (
    <>
      {/* Charge la librairie une fois, Next gère le cache */}
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
      />

      <div id="particles-js-1" style={style} />
    </>
  );
}
