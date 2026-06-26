"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { audio } from "@/lib/audio";
import featherImg from "@/assets/peacock-feather.png";

// Verbatim — exactly as written, curly apostrophes and all.
const LETTER_LINES = [
  "Hey Ms. Inal,",
  "Happiest 23rd Birthday.",
  "I hope I can make this birthday special for you.",
  "I don’t know what to write <3.",
  "When you came into my life, it became beautiful.",
  "You taught me many things which I cannot describe in such a short message, but I can say that I can never imagine a life without you.",
  "I hope this birthday will become your memorable one.",
  "From long distance, I can only do this much effort…!!!",
];
const SIGNATURE = "FOREVER YOUR’S: TOPPER";

const BODY = LETTER_LINES.join("\n");

export default function Scene4({ onHearts }: { onHearts: () => void }) {
  const [opened, setOpened] = useState(false);
  const [typed, setTyped] = useState("");
  const [sigTyped, setSigTyped] = useState("");
  const [bodyDone, setBodyDone] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  const open = () => {
    if (opened) return;
    setOpened(true);
    audio.playChime();
  };

  // Type the body once the envelope has opened and the letter slid up.
  useEffect(() => {
    if (!opened) return;
    const startDelay = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        i++;
        setTyped(BODY.slice(0, i));
        if (i < BODY.length) {
          const ch = BODY[i - 1];
          const delay = ch === "\n" ? 320 : ch === "." ? 90 : 26;
          timers.current.push(window.setTimeout(tick, delay));
        } else {
          setBodyDone(true);
        }
      };
      tick();
    }, 1300);
    timers.current.push(startDelay);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [opened]);

  // After the body, type the signature, then release the hearts.
  useEffect(() => {
    if (!bodyDone) return;
    let i = 0;
    const tick = () => {
      i++;
      setSigTyped(SIGNATURE.slice(0, i));
      if (i < SIGNATURE.length) {
        timers.current.push(window.setTimeout(tick, 70));
      } else {
        setDone(true);
        audio.playChime();
        onHearts();
      }
    };
    const t = window.setTimeout(tick, 500);
    timers.current.push(t);
  }, [bodyDone, onHearts]);

  return (
    <div className="scene-inner">
      <motion.h1
        className="scene-title soft"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        For you, Inal
      </motion.h1>

      {/* The letter — static anchor keeps it centered; inner motion slides it up */}
      <div className={`letter-anchor ${opened ? "is-open" : ""}`}>
        <motion.div
          className="letter"
          initial={false}
          animate={opened ? { y: 0, opacity: 1 } : { y: 320, opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: opened ? 0.55 : 0 }}
        >
          <div className="letter-paper">
            <p className="letter-body">
              {typed}
              {!bodyDone && <span className="caret" />}
            </p>
            {sigTyped && (
              <p className="letter-sign">
                {sigTyped}
                {bodyDone && !done && <span className="caret" />}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className={`envelope-stage ${opened ? "is-open" : ""}`}>
        {/* Envelope body */}
        <div className="env-back" />
        <div className="env-body">
          <div className="env-front" />
          <motion.div
            className="env-flap"
            initial={false}
            animate={
              opened
                ? { rotateX: 180, zIndex: 1 }
                : { rotateX: 0, zIndex: 30 }
            }
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            {/* peacock feather seal sits on the flap */}
            <motion.button
              className="feather"
              onClick={open}
              aria-label="Click the peacock feather to open"
              animate={
                opened
                  ? { scale: 0, opacity: 0, y: -30 }
                  : { scale: 1, opacity: 1 }
              }
              whileHover={!opened ? { scale: 1.12, rotate: -6 } : undefined}
              transition={{ duration: 0.5 }}
            >
              <Image src={featherImg} alt="Peacock feather seal" priority />
            </motion.button>
          </motion.div>
        </div>

        {opened && <div className="env-glow" />}
      </div>

      {!opened && (
        <motion.p
          className="normal-text env-hint"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          Click the peacock feather ✨
        </motion.p>
      )}

      {done && (
        <motion.p
          className="title-fancy closing"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          I love you 💜
        </motion.p>
      )}
    </div>
  );
}
