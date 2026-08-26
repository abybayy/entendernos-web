import flipcardUrl from "@/assets/flipcard.mp3";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (localStorage.getItem("entendernos:silent") === "1") return null;
  } catch {}
  if (!ctx) {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function isSilent(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem("entendernos:silent") === "1";
  } catch {
    return false;
  }
}

/** Internal: short tone burst with soft envelope. Duration in seconds. */
function tone(freq: number, durMs: number, volume: number, type: OscillatorType = "sine", freqEnd?: number) {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  const dur = durMs / 1000;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (freqEnd !== undefined) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(volume, now + Math.min(0.008, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

/** Filtered noise burst helper (used for whoosh / menu swish). */
function noiseBurst(volume: number, duration: number, freqStart: number, freqEnd: number) {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * duration), ac.sampleRate);
  const data = buffer.getChannelData(0);
  let lp = 0;
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    const env = Math.sin(Math.PI * t);
    const w = Math.random() * 2 - 1;
    lp = (lp + 0.05 * w) / 1.05;
    data[i] = lp * 4 * env;
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(freqStart, now);
  bp.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  src.connect(bp).connect(g).connect(ac.destination);
  src.start(now);
  src.stop(now + duration);
}

/**
 * Flipcard SFX — decoded once into an AudioBuffer for near-zero latency.
 * Falls back to a pool of pre-loaded <audio> elements while decoding finishes.
 */
let flipBuffer: AudioBuffer | null = null;
let flipBufferLoading = false;
const flipPool: HTMLAudioElement[] = [];
let flipPoolIdx = 0;
const FLIP_POOL_SIZE = 4;

function ensureFlipPool() {
  if (typeof window === "undefined") return;
  if (flipPool.length) return;
  for (let i = 0; i < FLIP_POOL_SIZE; i++) {
    const a = new Audio(flipcardUrl);
    a.preload = "auto";
    a.load();
    flipPool.push(a);
  }
}

function ensureFlipBuffer() {
  if (flipBuffer || flipBufferLoading) return;
  const ac = getCtx();
  if (!ac) return;
  flipBufferLoading = true;
  fetch(flipcardUrl)
    .then((r) => r.arrayBuffer())
    .then((buf) => ac.decodeAudioData(buf))
    .then((decoded) => { flipBuffer = decoded; })
    .catch(() => {})
    .finally(() => { flipBufferLoading = false; });
}

if (typeof window !== "undefined") {
  ensureFlipPool();
}

/** Card flip / advance SFX. Zero-latency via WebAudio buffer + HTMLAudio fallback. */
export function playWhoosh(volume = 0.7) {
  if (isSilent()) return;
  const v = Math.max(0, Math.min(1, volume));
  const ac = getCtx();
  ensureFlipBuffer();
  if (ac && flipBuffer) {
    try {
      const src = ac.createBufferSource();
      src.buffer = flipBuffer;
      const g = ac.createGain();
      g.gain.value = v;
      src.connect(g).connect(ac.destination);
      src.start(0);
      return;
    } catch {}
  }
  ensureFlipPool();
  const a = flipPool[flipPoolIdx % flipPool.length];
  flipPoolIdx++;
  if (!a) return;
  try {
    a.volume = v;
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {}
}

/** Crystalline chime for level/tab transitions. Two-note shimmer. */
export function playChime(volume = 0.08) {
  const ac = getCtx();
  if (!ac) return;
  const notes = [987.77, 1318.51];
  const now = ac.currentTime;
  notes.forEach((freq, i) => {
    const start = now + i * 0.06;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(volume, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
    osc.connect(g).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.55);
  });
}

export function playTutorialNext() {
  tone(1320, 55, 0.05, "sine");
  setTimeout(() => tone(1760, 65, 0.05, "sine"), 45);
}

export function playMenuSwish(volume = 0.05) {
  noiseBurst(volume, 0.09, 900, 1600);
}

export function playClickPremium() {
  tone(220, 75, 0.09, "sine", 130);
}

export function playBack() {
  tone(660, 70, 0.05, "sine", 330);
}

export function playSwitchOn() {
  tone(1800, 35, 0.06, "triangle");
}

export function playTick() {
  tone(2200, 18, 0.025, "sine", 1600);
}

export function playSuccessChord(volume = 0.16) {
  const ac = getCtx();
  if (!ac) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const now = ac.currentTime;
  notes.forEach((freq, i) => {
    const start = now + i * 0.09;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(volume, start + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
    osc.connect(g).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.95);
  });
}
