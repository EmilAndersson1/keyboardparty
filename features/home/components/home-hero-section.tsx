"use client";

import { SparklesBackground } from "@/components/effects/sparkles-background";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const PARTY_SYMBOLS = [
  "\u{1F389}",
  "\u{2728}",
  "\u{1F308}",
  "\u{1F984}",
  "\u{1F388}",
  "\u{1F36D}",
  "\u{1F4A5}",
  "\u{2B50}",
  "\u{1FAA9}",
  "\u{1F3B5}",
] as const;

const PARTY_COLORS = [
  "#FF4D6D",
  "#FFD166",
  "#06D6A0",
  "#4CC9F0",
  "#F15BB5",
  "#9B5DE5",
] as const;

const MAX_ACTIVE_EFFECT_NODES = 140;
const KEY_EFFECT_COOLDOWN_MS = 48;
const MOUSE_EFFECT_INTERVAL_MS = 62;
const EFFECT_SIZE_MULTIPLIER = 1.3;

const randomFrom = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomInRange = (min: number, max: number) =>
  min + Math.random() * (max - min);

const normalizeKeyLabel = (key: string) => {
  if (key === " ") {
    return "Woop!!";
  }
  if (key === "Enter") {
    return "YIIHAAA";
  }
  if (key === "Backspace") {
    return "WOOOOOO";
  }
  if (key.length === 1) {
    return key.toUpperCase();
  }
  return (
    key
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 5)
      .toUpperCase() || "KEY"
  );
};

type PartyBurstLayerProps = {
  enabled: boolean;
};

const PartyBurstLayer = ({ enabled }: PartyBurstLayerProps) => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const lastMouseMoveRef = useRef(0);
  const lastKeyDownRef = useRef(0);

  const appendAnimatedNode = useCallback(
    (node: HTMLElement, durationMs: number) => {
      const layer = layerRef.current;
      if (!layer) {
        return;
      }

      while (layer.childElementCount >= MAX_ACTIVE_EFFECT_NODES) {
        layer.firstElementChild?.remove();
      }

      layer.appendChild(node);
      window.setTimeout(() => {
        node.remove();
      }, durationMs + 60);
    },
    [],
  );

  const createEmojiBurst = useCallback(
    (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i += 1) {
        const particle = document.createElement("span");
        particle.textContent = randomFrom(PARTY_SYMBOLS);
        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.pointerEvents = "none";
        particle.style.userSelect = "none";
        particle.style.zIndex = "30";
        particle.style.willChange = "transform, opacity";
        particle.style.fontSize = `${(20 + Math.random() * 18) * EFFECT_SIZE_MULTIPLIER}px`;

        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const distance = 30 + Math.random() * 95;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 50;
        const rotate = Math.random() * 180 - 90;
        const duration = 1700 + Math.random() * 900;

        particle.animate(
          [
            {
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0.3)",
            },
            {
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1.08)",
              offset: 0.22,
            },
            {
              opacity: 0,
              transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotate}deg) scale(0.9)`,
            },
          ],
          {
            duration,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );

        appendAnimatedNode(particle, duration);
      }
    },
    [appendAnimatedNode],
  );

  const createKeyLetter = useCallback(
    (x: number, y: number, keyLabel: string) => {
      const letter = document.createElement("span");
      const color = randomFrom(PARTY_COLORS);

      letter.textContent = keyLabel;
      letter.style.position = "fixed";
      letter.style.left = `${x}px`;
      letter.style.top = `${y}px`;
      letter.style.pointerEvents = "none";
      letter.style.userSelect = "none";
      letter.style.zIndex = "31";
      letter.style.fontWeight = "900";
      letter.style.letterSpacing = "0.06em";
      letter.style.fontFamily = "var(--font-geist-sans), sans-serif";
      letter.style.fontSize = `${(36 + Math.random() * 42) * EFFECT_SIZE_MULTIPLIER}px`;
      letter.style.color = color;
      letter.style.textShadow = `0 0 14px ${color}, 0 0 34px ${color}99`;
      letter.style.willChange = "transform, opacity";

      const spin = Math.random() * 40 - 20;
      const xDrift = Math.random() * 180 - 90;
      const duration = 2500 + Math.random() * 1100;

      letter.animate(
        [
          {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.15) rotate(0deg)",
            offset: 0,
          },
          {
            opacity: 1,
            transform: `translate(calc(-50% + ${xDrift * 0.25}px), calc(-50% - 28px)) scale(1.06) rotate(${spin * 0.45}deg)`,
            offset: 0.12,
          },
          {
            opacity: 1,
            transform: `translate(calc(-50% + ${xDrift * 0.75}px), calc(-50% - 115px)) scale(1) rotate(${spin * 0.8}deg)`,
            offset: 0.85,
          },
          {
            opacity: 0,
            transform: `translate(calc(-50% + ${xDrift}px), calc(-50% - 170px)) scale(0.92) rotate(${spin}deg)`,
            offset: 1,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      appendAnimatedNode(letter, duration);

      const flash = document.createElement("span");
      flash.textContent = "\u2736";
      flash.style.position = "fixed";
      flash.style.left = `${x}px`;
      flash.style.top = `${y}px`;
      flash.style.pointerEvents = "none";
      flash.style.userSelect = "none";
      flash.style.zIndex = "31";
      flash.style.fontSize = `${(24 + Math.random() * 14) * EFFECT_SIZE_MULTIPLIER}px`;
      flash.style.color = color;
      flash.style.textShadow = `0 0 12px ${color}, 0 0 24px ${color}`;
      flash.style.willChange = "transform, opacity";
      flash.animate(
        [
          {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.2)",
          },
          {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1.35)",
            offset: 0.22,
          },
          {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.75)",
          },
        ],
        {
          duration: 980,
          easing: "ease-out",
          fill: "forwards",
        },
      );
      appendAnimatedNode(flash, 980);

      const sparkCount = 6;
      for (let i = 0; i < sparkCount; i += 1) {
        const spark = document.createElement("span");
        const sparkColor = randomFrom(PARTY_COLORS);
        const angle = (360 / sparkCount) * i + (Math.random() * 18 - 9);
        const radians = (angle * Math.PI) / 180;
        const distance = 68 + Math.random() * 82;
        const dx = Math.cos(radians) * distance;
        const dy = Math.sin(radians) * distance;
        const sparkDuration = 1150 + Math.random() * 650;

        spark.style.position = "fixed";
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.width = `${3 * EFFECT_SIZE_MULTIPLIER}px`;
        spark.style.height = `${(16 + Math.random() * 12) * EFFECT_SIZE_MULTIPLIER}px`;
        spark.style.borderRadius = "999px";
        spark.style.background = sparkColor;
        spark.style.boxShadow = `0 0 10px ${sparkColor}`;
        spark.style.transformOrigin = "50% 100%";
        spark.style.pointerEvents = "none";
        spark.style.zIndex = "30";
        spark.style.willChange = "transform, opacity";

        spark.animate(
          [
            {
              opacity: 0,
              transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(0.2)`,
            },
            {
              opacity: 1,
              transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(1.15)`,
              offset: 0.2,
            },
            {
              opacity: 0,
              transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${angle}deg) scaleY(0.45)`,
            },
          ],
          {
            duration: sparkDuration,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );

        appendAnimatedNode(spark, sparkDuration);
      }
    },
    [appendAnimatedNode],
  );

  const createMouseSparkle = useCallback(
    (x: number, y: number) => {
      const layer = layerRef.current;
      if (!layer) {
        return;
      }

      const particle = document.createElement("span");
      particle.textContent = "\u{2728}";
      particle.style.position = "fixed";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.pointerEvents = "none";
      particle.style.userSelect = "none";
      particle.style.zIndex = "30";
      particle.style.willChange = "transform, opacity";
      particle.style.fontSize = `${(14 + Math.random() * 10) * EFFECT_SIZE_MULTIPLIER}px`;
      particle.style.color = randomFrom(PARTY_COLORS);

      const driftX = Math.random() * 26 - 13;
      const driftY = -(20 + Math.random() * 30);
      const duration = 1100 + Math.random() * 650;

      particle.animate(
        [
          {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.35)",
          },
          {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)",
            offset: 0.28,
          },
          {
            opacity: 0,
            transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.75)`,
          },
        ],
        {
          duration,
          easing: "ease-out",
          fill: "forwards",
        },
      );

      appendAnimatedNode(particle, duration);
    },
    [appendAnimatedNode],
  );

  useEffect(() => {
    const layer = layerRef.current;
    if (!enabled || !layer) {
      layer?.replaceChildren();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyDownRef.current < KEY_EFFECT_COOLDOWN_MS) {
        return;
      }
      lastKeyDownRef.current = now;

      const keyLabel = normalizeKeyLabel(event.key);
      const viewportPadding = 36;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const minX = viewportPadding;
      const maxX = Math.max(width - viewportPadding, minX + 1);
      const minY = viewportPadding;
      const maxY = Math.max(height - viewportPadding, minY + 1);

      const createCenterWeightedPoint = () => {
        const x = clamp(
          width * 0.5 + randomInRange(-width * 0.264, width * 0.264),
          minX,
          maxX,
        );
        const y = clamp(
          height * 0.56 + randomInRange(-height * 0.24, height * 0.24),
          minY,
          maxY,
        );
        return { x, y };
      };

      const createOuterRimPoint = () => {
        const edgeBand = Math.max(44, Math.min(width, height) * 0.14);
        const side = Math.floor(Math.random() * 4);

        if (side === 0) {
          return {
            x: randomInRange(minX, maxX),
            y: randomInRange(minY, minY + edgeBand),
          };
        }
        if (side === 1) {
          return {
            x: randomInRange(maxX - edgeBand, maxX),
            y: randomInRange(minY, maxY),
          };
        }
        if (side === 2) {
          return {
            x: randomInRange(minX, maxX),
            y: randomInRange(maxY - edgeBand, maxY),
          };
        }
        return {
          x: randomInRange(minX, minX + edgeBand),
          y: randomInRange(minY, maxY),
        };
      };

      const isOuterRimSpawn = Math.random() > 0.784;
      const letterPoint = isOuterRimSpawn
        ? createOuterRimPoint()
        : createCenterWeightedPoint();

      createKeyLetter(letterPoint.x, letterPoint.y, keyLabel);
      createEmojiBurst(letterPoint.x, letterPoint.y, 4);

      if (Math.random() > 0.64) {
        const burstPoint =
          Math.random() > 0.45
            ? createCenterWeightedPoint()
            : createOuterRimPoint();
        createEmojiBurst(burstPoint.x, burstPoint.y, 2);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      const minimumDelay = MOUSE_EFFECT_INTERVAL_MS;

      if (now - lastMouseMoveRef.current < minimumDelay) {
        return;
      }

      lastMouseMoveRef.current = now;
      if (Math.random() > 0.28) {
        createMouseSparkle(
          event.clientX + (Math.random() * 16 - 8),
          event.clientY + (Math.random() * 16 - 8),
        );
      }

      if (Math.random() > 0.92) {
        createEmojiBurst(event.clientX, event.clientY, 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      layer?.replaceChildren();
    };
  }, [createEmojiBurst, createKeyLetter, createMouseSparkle, enabled]);

  return (
    <div ref={layerRef} className="pointer-events-none fixed inset-0 z-30" />
  );
};

export const HomeHeroSection = () => {
  const [partyStarted, setPartyStarted] = useState(false);
  const year = new Date().getFullYear();
  const startParty = useCallback(() => {
    setPartyStarted(true);
  }, []);

  return (
    <section className="relative isolate flex h-[100dvh] min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black px-6">
      <div className="pointer-events-none fixed -inset-10 z-0">
        <motion.div
          className="h-full w-full"
          initial={false}
          animate={{ opacity: partyStarted ? 1 : 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <SparklesBackground
            id="home-sparkles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={partyStarted ? 64 : 0}
            speed={partyStarted ? 7 : 0}
            moveSpeedMin={partyStarted ? 1.5 : 0}
            moveSpeedMax={partyStarted ? 4 : 0}
            className="h-full w-full"
            particleColor="#FFFFFF"
          />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 text-center"
        initial={false}
        animate={
          partyStarted
            ? { opacity: 0, y: -34, scale: 0.985 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: partyStarted ? "none" : "auto" }}
      >
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          Keyboard Party Time
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-white/80 md:text-2xl">
          Press <span className="font-bold text-white">Get Started</span>, then
          smash your keyboard and wiggle your mouse to launch a rainbow emoji
          party.
        </p>
        <HoverBorderGradient
          className="cursor-pointer text-base font-semibold md:text-lg"
          onClick={startParty}
        >
          <span>Get Started</span>
        </HoverBorderGradient>
      </motion.div>

      <footer className="pointer-events-none fixed inset-x-0 z-20 text-center text-[11px] tracking-wide text-white/45 md:text-xs [bottom:max(0.75rem,env(safe-area-inset-bottom))]">
        {`© ${year} Emil Andersson · MIT Licensed`}
      </footer>

      <PartyBurstLayer enabled={partyStarted} />
    </section>
  );
};
