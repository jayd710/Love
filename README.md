# 💜 A Birthday Surprise for Inal

A romantic, cute, magical 4-scene birthday website built with **Next.js**,
**Framer Motion**, and the **Web Audio API** (all sounds are synthesized — no
external audio files to break).

## Run it locally

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** and tap **TAP TO BEGIN**.

> The first tap is needed so the browser allows music to play (browsers block
> autoplay until a user interacts with the page).

## The four scenes

1. **Panda** holds a "HAPPIEST BIRTHDAY" sign → "Should we move forward?"
   `YES` advances. `NO` runs away from your cursor (and from taps on mobile) —
   it can never be clicked. 😜
2. **Pop all the balloons** — 4 symmetric balloons (red / blue / green / yellow).
   Each pops with a sound, confetti burst, and a cute word popup. `NEXT` only
   appears once all four are popped.
3. **Make a wish** — click the candle ~4 times to blow it out. Then smoke,
   fireworks, confetti rain, a big "HAPPY BIRTHDAY INAL" banner, and the
   Happy Birthday tune. `NEXT` appears after the celebration.
4. **The letter** — a cream envelope sealed with a peacock feather. Click the
   feather to open it; the letter rises and types out line-by-line, ending with
   floating hearts.

## Extras

Floating hearts, sparkles, glowing particles, smooth fade transitions, bounce
animations, confetti, fireworks, a soft ambient background pad, a mute/unmute
button (top-right), and full mobile + desktop responsiveness.

## Deploy to Vercel

```bash
npx vercel        # preview
npx vercel --prod # production
```

Made with love. 💜
