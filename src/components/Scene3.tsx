"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { confettiRain, fireworks } from "@/lib/effects";

const CLICKS_TO_BLOW = 4;

export default function Scene3({ onNext }: { onNext: () => void }) {
  const [clicks, setClicks] = useState(0);
  const [blown, setBlown] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const flameScale = Math.max(0, 1 - clicks / CLICKS_TO_BLOW);

  const blow = () => {
    if (blown) return;
    const n = clicks + 1;
    setClicks(n);

    if (n >= CLICKS_TO_BLOW) {
      setBlown(true);
      // Celebration sequence
      setTimeout(() => {
        setCelebrate(true);
        fireworks(5000);
        confettiRain(5000);
        audio.playHappyBirthday();
      }, 350);
      // "after the celebration finishes" — reveal NEXT a few seconds later
      setTimeout(() => setShowNext(true), 6500);
    }
  };

  return (
    <div className="scene-inner">
      <motion.h1
        className="scene-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: celebrate ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        MAKE A WISH
      </motion.h1>

      <div className="cake-wrap">
        {/* Candle (the click target) */}
        <button
          className="candle"
          onClick={blow}
          aria-label="Click the candle to blow it out"
        >
          <div className="flame-area">
            <AnimatePresence>
              {!blown && (
                <motion.div
                  className="flame"
                  style={{ transformOrigin: "bottom center" }}
                  initial={{ scale: 1 }}
                  animate={{ scale: flameScale, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 14 }}
                >
                  <span className="flame-inner" />
                  <span className="flame-glow" />
                </motion.div>
              )}
            </AnimatePresence>

            {blown && (
              <div className="smoke">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
          <div className="wick" />
          <div className="candle-stick" />
        </button>

        {/* Cake */}
        <div className="cake">
          <div className="cake-layer cake-top">
            <div className="frosting" />
            <span className="drip" style={{ left: "12%" }} />
            <span className="drip" style={{ left: "32%" }} />
            <span className="drip" style={{ left: "52%" }} />
            <span className="drip" style={{ left: "72%" }} />
            <span className="drip" style={{ left: "88%" }} />
          </div>
          <div className="cake-layer cake-mid">
            <span className="sprinkle" /><span className="sprinkle" />
            <span className="sprinkle" /><span className="sprinkle" />
            <span className="sprinkle" />
          </div>
          <div className="cake-layer cake-bottom">
            <span className="sprinkle" /><span className="sprinkle" />
            <span className="sprinkle" /><span className="sprinkle" />
          </div>
          <div className="cake-plate" />
        </div>
      </div>

      {!blown && (
        <motion.p
          className="normal-text cake-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Blow the candle by clicking on the candle.
          {clicks > 0 && (
            <span className="puff-hint"> keep going… 💨</span>
          )}
        </motion.p>
      )}

      {/* Big banner dropping from the top */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="bday-banner"
            initial={{ y: "-120%", opacity: 0, rotate: -4 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.2 }}
          >
            HAPPY BIRTHDAY INAL
          </motion.div>
        )}
      </AnimatePresence>

      <div className="next-slot">
        <AnimatePresence>
          {showNext && (
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
    </div>
  );
}
