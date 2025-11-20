/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    particlesJS: any;
    pJSDom: any[];
  }
}

type ParticlesBackgroundProps = {
  mode?: "full" | "section";
  id?: string;
  density?: number;
  size?: number;
  responsive?: boolean;
};

export default function ParticlesBackground({
  mode = "full",
  id = "particles-js-hero",
  density = 100,
  size = 4,
  responsive = true,
}: ParticlesBackgroundProps) {
  const [responsiveDensity, setResponsiveDensity] = useState(density);
  const [responsiveSize, setResponsiveSize] = useState(size);

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

  // Gestion du responsive
  useEffect(() => {
    if (!responsive || typeof window === "undefined") return;

    const updateResponsiveSettings = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setResponsiveDensity(30);
        setResponsiveSize(1.5);
      } else if (width < 1024) {
        setResponsiveDensity(70);
        setResponsiveSize(3);
      } else {
        setResponsiveDensity(density);
        setResponsiveSize(size);
      }
    };

    updateResponsiveSettings();
    window.addEventListener("resize", updateResponsiveSettings);

    return () => window.removeEventListener("resize", updateResponsiveSettings);
  }, [responsive, density, size]);

  const initParticles = () => {
    if (
      typeof window === "undefined" ||
      !window.particlesJS ||
      !document.getElementById(id)
    ) {
      return;
    }

    // Détruit les particules existantes avant de re-créer
    if (window.pJSDom && window.pJSDom.length > 0) {
      window.pJSDom.forEach((pJS: any) => {
        if (pJS.pJS && pJS.pJS.fn && pJS.pJS.fn.vendors) {
          pJS.pJS.fn.vendors.destroy();
        }
      });
      window.pJSDom = [];
    }

    window.particlesJS(id, {
      particles: {
        number: {
          value: responsiveDensity,
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
          value: responsiveSize,
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

  // Re-initialise les particules quand les paramètres responsive changent
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
  }, [id, responsiveDensity, responsiveSize]);

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
