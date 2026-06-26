"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Panda from "./Panda";
import { audio } from "@/lib/audio";
import { cannons } from "@/lib/effects";

const TAUNTS = [
  "Nope! 😜",
  "Catch me!",
  "Try again 💨",
  "Too slow!",
  "Not today 🙈",
  "Hehe~",
  "Nice try 💕",
];

export default function Scene1({ onNext }: { onNext: () => void }) {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [taunt, setTaunt] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const noRef = useRef<HTMLButtonElement>(null);

  // Pick a fresh random on-screen spot, clamped well inside the viewport.
  const jump = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const bw = 130;
    const bh = 60;
    const margin = 24;
    const x = margin + Math.random() * (w - bw - margin * 2);
    const y = margin + Math.random() * (h - bh - margin * 2);
    setNoPos({ x, y });
    setEscaped(true);
    setTaunt((t) => (t + 1) % TAUNTS.length);
  }, []);

  // Run away whenever the pointer gets near it.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const btn = noRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < 110) jump();
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [jump]);

  const evade = (e: React.SyntheticEvent) => {
    e.preventDefault();
    jump();
  };

  const sayYes = () => {
    audio.playChime();
    cannons();
    onNext();
  };

  return (
    <div className="scene-inner scene1">
      <motion.div
        className="panda-wrap"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      >
        <div className="panda-sign">
          <span>HAPPIEST</span>
          <span>BIRTHDAY</span>
        </div>
        <div className="bounce-soft">
          <Panda />
        </div>
      </motion.div>

      <motion.p
        className="normal-text scene1-q"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Should we move forward?
      </motion.p>

      <div className="scene1-btns">
        <button className="btn btn-primary" onClick={sayYes}>
          YES
        </button>

        <button
          ref={noRef}
          className="btn btn-ghost no-btn"
          style={
            noPos
              ? { position: "fixed", left: noPos.x, top: noPos.y, margin: 0 }
              : undefined
          }
          onPointerEnter={evade}
          onPointerDown={evade}
          onTouchStart={evade}
          onFocus={evade}
          onClick={evade}
          aria-label="No (you can't catch me)"
        >
          NO
        </button>
      </div>

      {escaped && (
        <motion.p
          key={taunt}
          className="taunt"
          initial={{ opacity: 0, y: 6, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          {TAUNTS[taunt]}
        </motion.p>
      )}
    </div>
  );
}
