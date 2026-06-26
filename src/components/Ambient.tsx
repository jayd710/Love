"use client";

import { useEffect, useState } from "react";

type Bit = {
  id: number;
  left: number;
  size: number;
  delay: number;
  dur: number;
  dx: number;
  opacity: number;
  char?: string;
};

const HEARTS = ["💜", "💗", "💖", "🩷", "✨"];

function makeBits(count: number, withChar: boolean): Bit[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 0.7 + Math.random() * 1.6,
    delay: Math.random() * 12,
    dur: 9 + Math.random() * 12,
    dx: (Math.random() - 0.5) * 120,
    opacity: 0.45 + Math.random() * 0.45,
    char: withChar
      ? HEARTS[Math.floor(Math.random() * HEARTS.length)]
      : undefined,
  }));
}

/**
 * Always-present ambient layer: floating hearts, twinkling sparkles and
 * tiny glowing particles drifting upward. `heartburst` cranks up the hearts
 * (used on the final letter scene).
 */
export default function Ambient({ heartburst = false }: { heartburst?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [hearts, setHearts] = useState<Bit[]>([]);
  const [sparks, setSparks] = useState<Bit[]>([]);
  const [dust, setDust] = useState<Bit[]>([]);

  useEffect(() => {
    setHearts(makeBits(14, true));
    setSparks(makeBits(22, false));
    setDust(makeBits(30, false));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* floating hearts */}
      <div className="fx-layer">
        {hearts.map((b) => (
          <span
            key={`h${b.id}`}
            style={{
              position: "absolute",
              left: `${b.left}%`,
              bottom: "-8vh",
              fontSize: `${b.size * (heartburst ? 1.5 : 1.1)}rem`,
              animation: `floatUp ${b.dur}s linear ${b.delay}s infinite`,
              ["--dx" as string]: `${b.dx}px`,
              ["--o" as string]: heartburst ? 0.9 : b.opacity,
              ["--s" as string]: 1,
              filter: "drop-shadow(0 0 8px rgba(255,180,230,0.6))",
            }}
          >
            {b.char}
          </span>
        ))}
      </div>

      {/* twinkling sparkles */}
      <div className="fx-layer">
        {sparks.map((b) => (
          <span
            key={`s${b.id}`}
            style={{
              position: "absolute",
              left: `${b.left}%`,
              top: `${(b.id * 4.5) % 100}%`,
              width: `${4 + b.size * 4}px`,
              height: `${4 + b.size * 4}px`,
              background:
                "radial-gradient(circle, #fff 0%, rgba(255,255,255,0.2) 60%, transparent 70%)",
              borderRadius: "50%",
              animation: `twinkle ${2.5 + b.size}s ease-in-out ${b.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* tiny glowing particles drifting up */}
      <div className="fx-layer">
        {dust.map((b) => (
          <span
            key={`d${b.id}`}
            style={{
              position: "absolute",
              left: `${b.left}%`,
              bottom: "-5vh",
              width: `${2 + b.size * 2.5}px`,
              height: `${2 + b.size * 2.5}px`,
              background: "rgba(255,255,255,0.85)",
              borderRadius: "50%",
              boxShadow: "0 0 10px 2px rgba(255,210,245,0.7)",
              animation: `floatUp ${b.dur * 1.2}s linear ${b.delay}s infinite`,
              ["--dx" as string]: `${b.dx}px`,
              ["--o" as string]: b.opacity * 0.8,
              ["--s" as string]: 1,
            }}
          />
        ))}
      </div>
    </>
  );
}
