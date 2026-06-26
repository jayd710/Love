"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { burstAt, cannons } from "@/lib/effects";

type BalloonDef = {
  id: number;
  word: string;
  color: string;
  light: string;
  burst: string[];
};

const BALLOONS: BalloonDef[] = [
  { id: 0, word: "Happiest", color: "#ff4d6d", light: "#ff97ab", burst: ["#ff4d6d", "#ff97ab", "#fff"] },
  { id: 1, word: "Birthday", color: "#4d8bff", light: "#9bbcff", burst: ["#4d8bff", "#9bbcff", "#fff"] },
  { id: 2, word: "to", color: "#39d98a", light: "#8fe9bf", burst: ["#39d98a", "#8fe9bf", "#fff"] },
  { id: 3, word: "Inal", color: "#ffd23d", light: "#ffe487", burst: ["#ffd23d", "#ffe487", "#fff"] },
];

type Popup = { uid: number; word: string; color: string; x: number; y: number };

export default function Scene2({ onNext }: { onNext: () => void }) {
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const [popups, setPopups] = useState<Popup[]>([]);
  const uid = useRef(0);

  const allPopped = popped.size === BALLOONS.length;

  const pop = (b: BalloonDef, e: React.MouseEvent<HTMLButtonElement>) => {
    if (popped.has(b.id)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    audio.playPop();
    burstAt(x, y, b.burst);

    setPopped((prev) => {
      const next = new Set(prev);
      next.add(b.id);
      if (next.size === BALLOONS.length) setTimeout(() => cannons(), 250);
      return next;
    });

    const popup: Popup = { uid: uid.current++, word: b.word, color: b.color, x, y };
    setPopups((p) => [...p, popup]);
    setTimeout(() => {
      setPopups((p) => p.filter((q) => q.uid !== popup.uid));
    }, 1800);
  };

  return (
    <div className="scene-inner">
      <motion.h1
        className="scene-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        POP ALL THE BALLOONS
      </motion.h1>

      <div className="balloon-grid">
        {BALLOONS.map((b) => (
          <div key={b.id} className="balloon-cell">
            <AnimatePresence>
              {!popped.has(b.id) && (
                <motion.button
                  className="balloon"
                  aria-label={`Pop the ${b.word} balloon`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: [0, -12, 0],
                  }}
                  exit={{ scale: 1.4, opacity: 0 }}
                  transition={{
                    scale: { type: "spring", stiffness: 140, damping: 11 },
                    y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.18 },
                  }}
                  whileHover={{ scale: 1.07 }}
                  onClick={(e) => pop(b, e)}
                  style={{
                    ["--c" as string]: b.color,
                    ["--cl" as string]: b.light,
                  }}
                >
                  <span className="balloon-shine" />
                  <span className="balloon-knot" />
                  <span className="balloon-string" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="next-slot">
        <AnimatePresence>
          {allPopped && (
            <motion.button
              className="btn btn-primary next-btn"
              initial={{ opacity: 0, scale: 0.6, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 12 }}
              onClick={() => {
                audio.playChime();
                onNext();
              }}
            >
              NEXT
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* cute word popups (static anchor centers it; inner motion animates) */}
      <AnimatePresence>
        {popups.map((p) => (
          <div
            key={p.uid}
            className="word-popup-anchor"
            style={{ left: p.x, top: p.y }}
          >
            <motion.div
              className="word-popup"
              style={{ ["--pc" as string]: p.color }}
              initial={{ opacity: 0, scale: 0.3, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: -70 }}
              exit={{ opacity: 0, scale: 0.6, y: -110 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
            >
              {p.word}
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
