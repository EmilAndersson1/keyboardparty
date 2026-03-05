"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { motion, useAnimation } from "motion/react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container } from "@tsparticles/engine";
import { cn } from "@/lib/utils";
import { createSparklesOptions } from "@/lib/particles/sparkles-options";

type SparklesBackgroundProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesBackground = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
}: SparklesBackgroundProps) => {
  const [isReady, setIsReady] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsReady(true);
    });
  }, []);

  const options = useMemo(
    () =>
      createSparklesOptions({
        background,
        minSize,
        maxSize,
        speed,
        particleColor,
        particleDensity,
      }),
    [background, minSize, maxSize, speed, particleColor, particleDensity]
  );

  const particlesLoaded = async (container?: Container) => {
    if (!container) {
      return;
    }

    await controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    });
  };

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {isReady ? (
        <Particles
          id={id ?? generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      ) : null}
    </motion.div>
  );
};
