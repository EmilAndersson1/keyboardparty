import type { ISourceOptions } from "@tsparticles/engine";

type CreateSparklesOptionsParams = {
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const createSparklesOptions = ({
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
}: CreateSparklesOptionsParams): ISourceOptions => {
  return {
    background: {
      color: {
        value: background ?? "transparent",
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
      },
    },
    particles: {
      color: {
        value: particleColor ?? "#ffffff",
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        speed: {
          min: 0.1,
          max: 1,
        },
      },
      number: {
        density: {
          enable: true,
          width: 400,
          height: 400,
        },
        value: particleDensity ?? 120,
      },
      opacity: {
        value: {
          min: 0.1,
          max: 1,
        },
        animation: {
          enable: true,
          speed: speed ?? 4,
          mode: "auto",
          startValue: "random",
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: {
          min: minSize ?? 1,
          max: maxSize ?? 3,
        },
      },
    },
    detectRetina: true,
  };
};
