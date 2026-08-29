/**
 * Original ambient drone generated with the Web Audio API — a tanpura-like
 * tonic/fifth pad with slow plucked pentatonic notes. No external audio,
 * no copyrighted material, nothing to download.
 */

type Nodes = {
  ctx: AudioContext;
  master: GainNode;
  timer: number | null;
  stopped: boolean;
};

const SA = 146.83; // D3
const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4];

export function createAmbience(): {
  start: () => Promise<void>;
  stop: () => void;
  dispose: () => void;
} {
  let n: Nodes | null = null;

  const pluck = (nodes: Nodes) => {
    const { ctx, master } = nodes;
    const t = ctx.currentTime;
    const ratio = SCALE[Math.floor(Math.random() * SCALE.length)] ?? 1;
    const freq = SA * 2 * ratio;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    osc.type = "triangle";
    osc2.type = "sine";
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 2.001;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
    osc.connect(g);
    osc2.connect(g);
    g.connect(filter);
    filter.connect(master);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 3.6);
    osc2.stop(t + 3.6);
  };

  const schedule = (nodes: Nodes) => {
    if (nodes.stopped) return;
    pluck(nodes);
    nodes.timer = window.setTimeout(
      () => schedule(nodes),
      1800 + Math.random() * 2600,
    );
  };

  const start = async () => {
    if (typeof window === "undefined") return;
    if (!n) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // sustained drone: tonic + fifth with slow detune shimmer
      [SA, SA * 1.5, SA * 2].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        osc.type = i === 2 ? "sine" : "sawtooth";
        osc.frequency.value = f;
        g.gain.value = i === 0 ? 0.05 : 0.03;
        lfo.frequency.value = 0.07 + i * 0.03;
        lfoGain.gain.value = 0.6 + i;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 900;
        osc.connect(g);
        g.connect(lp);
        lp.connect(master);
        osc.start();
        lfo.start();
      });

      n = { ctx, master, timer: null, stopped: false };
      schedule(n);
    }
    n.stopped = false;
    await n.ctx.resume();
    n.master.gain.cancelScheduledValues(n.ctx.currentTime);
    n.master.gain.setTargetAtTime(0.5, n.ctx.currentTime, 1.2);
    if (n.timer === null) schedule(n);
  };

  const stop = () => {
    if (!n) return;
    n.stopped = true;
    if (n.timer !== null) {
      window.clearTimeout(n.timer);
      n.timer = null;
    }
    n.master.gain.cancelScheduledValues(n.ctx.currentTime);
    n.master.gain.setTargetAtTime(0.0001, n.ctx.currentTime, 0.5);
  };

  const dispose = () => {
    if (!n) return;
    stop();
    void n.ctx.close();
    n = null;
  };

  return { start, stop, dispose };
}
