import confetti from "canvas-confetti";

const PINK_PURPLE = [
  "#8E2DE2", "#C471ED", "#FF69B4", "#F64F59", "#D16BA5",
  "#BA83CA", "#FFB6D5", "#ffffff", "#FFD93D",
];

/** Small burst from a specific screen point (x,y in px). */
export function burstAt(x: number, y: number, colors?: string[]) {
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 32,
    scalar: 0.9,
    ticks: 120,
    origin: {
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    },
    colors: colors ?? PINK_PURPLE,
    disableForReducedMotion: true,
  });
}

/** Confetti raining down from the top for a duration (ms). */
export function confettiRain(durationMs = 4000) {
  const end = Date.now() + durationMs;
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 90,
      spread: 60,
      startVelocity: 25,
      gravity: 0.9,
      ticks: 220,
      origin: { x: Math.random(), y: -0.1 },
      colors: PINK_PURPLE,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Fireworks bursts across the screen for a duration (ms). */
export function fireworks(durationMs = 4500) {
  const end = Date.now() + durationMs;
  const tick = () => {
    confetti({
      particleCount: 40,
      spread: 360,
      startVelocity: 30,
      ticks: 90,
      gravity: 0.7,
      scalar: 1.1,
      origin: {
        x: 0.15 + Math.random() * 0.7,
        y: 0.15 + Math.random() * 0.45,
      },
      colors: PINK_PURPLE,
      shapes: ["circle", "star"],
      disableForReducedMotion: true,
    });
    if (Date.now() < end) setTimeout(tick, 280 + Math.random() * 220);
  };
  tick();
}

/** A celebratory side-cannon blast (used when NEXT unlocks etc). */
export function cannons() {
  const opts = {
    particleCount: 90,
    spread: 80,
    startVelocity: 45,
    colors: PINK_PURPLE,
    disableForReducedMotion: true,
  };
  confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.7 } });
}
