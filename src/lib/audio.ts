// A tiny Web Audio engine — no external files, everything synthesized.
// Handles: pop sounds, the Happy Birthday melody, a soft ambient pad,
// and a global mute toggle. The AudioContext must be unlocked from a
// user gesture (the "TAP TO BEGIN" button) or browsers stay silent.

type PadHandle = { stop: () => void };

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private pad: PadHandle | null = null;
  private padWanted = false;

  /** Call from a user gesture. Safe to call repeatedly. */
  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    // start ambient pad if it was requested before unlock
    if (this.padWanted && !this.pad) this.startPad();
  }

  get isMuted() {
    return this.muted;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(m ? 0 : 1, this.ctx.currentTime, 0.05);
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // ---- Balloon pop: a short pitched blip + a noise transient ----
  playPop() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t = ctx.currentTime;

    // pitched "boop"
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(720, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.16);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.24);

    // noise burst for the "pop"
    const dur = 0.12;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.35, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 900;
    noise.connect(hp).connect(ng).connect(master);
    noise.start(t);
    noise.stop(t + dur);
  }

  // ---- Soft chime, used for letter reveal / sparkle moments ----
  playChime() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    [880, 1108.7, 1318.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      const start = t + i * 0.09;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.22, start + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
      osc.connect(g).connect(master);
      osc.start(start);
      osc.stop(start + 0.95);
    });
  }

  // ---- Happy Birthday melody (public domain) ----
  playHappyBirthday() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    // note frequencies
    const N: Record<string, number> = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0,
      A4: 440.0, Bb4: 466.16, B4: 493.88, C5: 523.25, D5: 587.33,
      E5: 659.25, F5: 698.46,
    };
    // [note, beats] — classic Happy Birthday in F
    const beat = 0.42;
    const melody: [string, number][] = [
      ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["F4", 1], ["E4", 2],
      ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["G4", 1], ["F4", 2],
      ["C4", 0.75], ["C4", 0.25], ["C5", 1], ["A4", 1], ["F4", 1], ["E4", 1], ["D4", 2],
      ["Bb4", 0.75], ["Bb4", 0.25], ["A4", 1], ["F4", 1], ["G4", 1], ["F4", 3],
    ];

    let t = ctx.currentTime + 0.06;
    for (const [name, beats] of melody) {
      const dur = beats * beat;
      const freq = N[name];
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;

      // gentle bell envelope
      const a = 0.02;
      const peak = 0.26;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.setTargetAtTime(0.0001, t + dur * 0.55, dur * 0.3);

      // little soft harmonic for warmth
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(peak * 0.25, t + a);
      g2.gain.setTargetAtTime(0.0001, t + dur * 0.5, dur * 0.3);

      osc.connect(g).connect(master);
      osc2.connect(g2).connect(master);
      osc.start(t);
      osc2.start(t);
      osc.stop(t + dur + 0.05);
      osc2.stop(t + dur + 0.05);

      t += dur;
    }
    return (t - ctx.currentTime) * 1000; // total ms
  }

  // ---- Soft ambient pad (slow sine + gentle LFO), for background music ----
  requestPad() {
    this.padWanted = true;
    if (this.ctx && !this.pad) this.startPad();
  }
  stopPad() {
    this.padWanted = false;
    this.pad?.stop();
    this.pad = null;
  }

  private startPad() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t = ctx.currentTime;

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.0001, t);
    padGain.gain.exponentialRampToValueAtTime(0.07, t + 3);
    padGain.connect(master);

    // gentle chord (Dmaj-ish, soft)
    const freqs = [220, 277.18, 329.63, 440];
    const oscs: OscillatorNode[] = [];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const og = ctx.createGain();
      og.gain.value = i === 0 ? 0.5 : 0.28;

      // slow LFO on gain for breathing motion
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.06 + i * 0.02;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.12;
      lfo.connect(lfoGain).connect(og.gain);
      lfo.start(t);

      o.connect(og).connect(padGain);
      o.start(t);
      oscs.push(o, lfo);
    });

    this.pad = {
      stop: () => {
        const now = ctx.currentTime;
        padGain.gain.cancelScheduledValues(now);
        padGain.gain.setTargetAtTime(0.0001, now, 0.6);
        oscs.forEach((o) => {
          try {
            o.stop(now + 2);
          } catch {
            /* already stopped */
          }
        });
      },
    };
  }
}

export const audio = new AudioEngine();
