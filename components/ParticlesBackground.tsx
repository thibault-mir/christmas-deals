/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    particlesJS: any;
  }
}

type ParticlesBackgroundProps = {
  mode?: "full" | "section";
  id?: string;
  density?: number; // ← nouveau : nombre de particules
  size?: number; // ← nouveau : taille des flocons
};

export default function ParticlesBackground({
  mode = "full",
  id = "particles-js-hero",
  density = 100,
  size = 4,
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

  const initParticles = () => {
    if (
      typeof window === "undefined" ||
      !window.particlesJS ||
      !document.getElementById(id)
    ) {
      return;
    }

    window.particlesJS(id, {
      particles: {
        number: {
          value: density, // ← utilise la prop
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
          value: size, // ← utilise la prop
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
  };

  useEffect(() => {
    let tries = 0;
    const interval = setInterval(() => {
      if (window.particlesJS && document.getElementById(id)) {
        initParticles();
        clearInterval(interval);
      }
      tries++;
      if (tries > 20) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, density, size]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
        onLoad={initParticles}
      />
      <div id={id} style={style} />
    </>
  );
}
