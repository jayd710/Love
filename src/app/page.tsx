"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import Ambient from "@/components/Ambient";
import Scene1 from "@/components/Scene1";
import Scene2 from "@/components/Scene2";
import Scene3 from "@/components/Scene3";
import Scene4 from "@/components/Scene4";

const GRADIENTS = [
  "linear-gradient(135deg, #8E2DE2 0%, #FF69B4 100%)",
  "linear-gradient(135deg, #C471ED 0%, #F64F59 100%)",
  "linear-gradient(135deg, #D16BA5 0%, #C777B9 50%, #BA83CA 100%)",
  "linear-gradient(160deg, #8E2DE2 0%, #C471ED 45%, #FF69B4 100%)",
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [scene, setScene] = useState(1);
  const [muted, setMuted] = useState(false);
  const [heartburst, setHeartburst] = useState(false);

  const begin = () => {
    audio.unlock();
    audio.requestPad(); // soft ambient background
    setStarted(true);
  };

  const toggleMute = () => setMuted(audio.toggleMute());

  const goTo = useCallback((n: number) => setScene(n), []);
  const onHearts = useCallback(() => setHeartburst(true), []);

  return (
    <div className="app-root">
      {/* Cross-fading gradient backgrounds */}
      {GRADIENTS.map((g, i) => (
        <motion.div
          key={i}
          className="bg-layer"
          style={{ background: g }}
          initial={false}
          animate={{ opacity: scene === i + 1 ? 1 : 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      ))}
      <div className="bg-vignette" />

      <Ambient heartburst={heartburst} />

      {/* Mute / unmute */}
      {started && (
        <button className="mute-btn" onClick={toggleMute} aria-label="Toggle music">
          {muted ? "🔇" : "🔊"}
        </button>
      )}

      {/* Start gate (unlocks audio) */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="start-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="start-card"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 13 }}
            >
              <div className="start-emoji bounce-soft">🎀</div>
              <h1 className="title-fancy start-title">A little surprise</h1>
              <p className="normal-text start-sub">made with love, just for you</p>
              <button className="btn btn-primary" onClick={begin}>
                TAP TO BEGIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenes */}
      {started && (
        <main className="stage">
          <AnimatePresence mode="wait">
            <motion.section
              key={scene}
              className="scene"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {scene === 1 && <Scene1 onNext={() => goTo(2)} />}
              {scene === 2 && <Scene2 onNext={() => goTo(3)} />}
              {scene === 3 && <Scene3 onNext={() => goTo(4)} />}
              {scene === 4 && <Scene4 onHearts={onHearts} />}
            </motion.section>
          </AnimatePresence>
        </main>
      )}
    </div>
  );
}
