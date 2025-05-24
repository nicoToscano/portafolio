import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  // Colores del fondo y partículas
  const [bgColor, setBgColor] = useState("#0f0f1a");
  const [particleColor, setParticleColor] = useState("#ffffff");

  // Función para obtener los valores de las variables CSS
  const updateColorsFromCSS = () => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const bg = computed.getPropertyValue("--background-hex").trim();
    const fg = computed.getPropertyValue("--foreground-hex").trim();

    // Actualizar los estados con los valores obtenidos
    setBgColor(bg);
    setParticleColor(fg);
  };

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    updateColorsFromCSS();

    // Observar cambios de tema (clase "dark" en html)
    const observer = new MutationObserver(() => {
      updateColorsFromCSS();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // console.log(container);
  };

  const options: ISourceOptions = useMemo(() => ({
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: { value: bgColor } },
    particles: {
      number: { value: 60 },
      color: { value: particleColor },
      links: {
        enable: true,
        distance: 150,
        color: particleColor,
        opacity: 0.3,
        width: 1,
      },
      move: { enable: true, speed: 1 },
      size: { value: 2 },
      opacity: { value: 0.5 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        repulse: { distance: 100 },
      },
    },
  }), [bgColor, particleColor]);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
}
