/**
 * Geometry helpers used to generate original mehendi-style vector artwork.
 * Everything here is pure so it renders identically on the server and client.
 */

export const r2 = (n: number) => Math.round(n * 100) / 100;

/** A teardrop petal drawn upward from the origin. */
export function petal(len: number, width: number, pinch = 0.32): string {
  return [
    `M0 0`,
    `C ${r2(width)} ${r2(-len * pinch)} ${r2(width * 0.62)} ${r2(-len * 0.82)} 0 ${r2(-len)}`,
    `C ${r2(-width * 0.62)} ${r2(-len * 0.82)} ${r2(-width)} ${r2(-len * pinch)} 0 0`,
    `Z`,
  ].join(" ");
}

/** A pointed henna leaf with a slight sway. */
export function leaf(len: number, width: number, sway = 0.25): string {
  const s = len * sway;
  return [
    `M0 0`,
    `C ${r2(width)} ${r2(-len * 0.3)} ${r2(width * 0.5)} ${r2(-len * 0.75)} ${r2(s)} ${r2(-len)}`,
    `C ${r2(-width * 0.5)} ${r2(-len * 0.75)} ${r2(-width)} ${r2(-len * 0.3)} 0 0`,
    `Z`,
  ].join(" ");
}

/** Classic paisley (buta) outline, opening upward-right. */
export function paisley(scale = 1): string {
  const s = (n: number) => r2(n * scale);
  return [
    `M0 0`,
    `C ${s(-17)} ${s(-13)} ${s(-22)} ${s(-44)} ${s(-6)} ${s(-62)}`,
    `C ${s(9)} ${s(-78)} ${s(35)} ${s(-73)} ${s(40)} ${s(-52)}`,
    `C ${s(46)} ${s(-29)} ${s(28)} ${s(-6)} 0 0`,
    `Z`,
  ].join(" ");
}

/** Inner echo line of a paisley. */
export function paisleyInner(scale = 1): string {
  const s = (n: number) => r2(n * scale);
  return [
    `M${s(-2)} ${s(-9)}`,
    `C ${s(-13)} ${s(-21)} ${s(-14)} ${s(-42)} ${s(-2)} ${s(-54)}`,
    `C ${s(9)} ${s(-66)} ${s(27)} ${s(-62)} ${s(31)} ${s(-48)}`,
    `C ${s(35)} ${s(-31)} ${s(21)} ${s(-14)} ${s(-2)} ${s(-9)}`,
  ].join(" ");
}

/** Scalloped circle used for mandala rings and arches. */
export function scallop(cx: number, cy: number, r: number, count: number, depth = 6): string {
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const a0 = (i / count) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / count) * Math.PI * 2 - Math.PI / 2;
    const am = (a0 + a1) / 2;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const xm = cx + Math.cos(am) * (r + depth);
    const ym = cy + Math.sin(am) * (r + depth);
    if (i === 0) parts.push(`M${r2(x0)} ${r2(y0)}`);
    parts.push(`Q ${r2(xm)} ${r2(ym)} ${r2(x1)} ${r2(y1)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

/** Evenly spaced dots on a circle. */
export function ringDots(cx: number, cy: number, r: number, count: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((i + offset) / count) * Math.PI * 2 - Math.PI / 2;
    return { cx: r2(cx + Math.cos(a) * r), cy: r2(cy + Math.sin(a) * r), key: `${r}-${i}` };
  });
}

/** Rotational placements around a centre. */
export function radial(count: number, cx: number, cy: number, r: number, startDeg = 0) {
  return Array.from({ length: count }, (_, i) => {
    const deg = startDeg + (i / count) * 360;
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      i,
      deg,
      x: r2(cx + Math.cos(rad) * r),
      y: r2(cy + Math.sin(rad) * r),
      transform: `translate(${r2(cx + Math.cos(rad) * r)} ${r2(cy + Math.sin(rad) * r)}) rotate(${r2(deg)})`,
    };
  });
}

/** A sinuous vine with leaves and dots budding along it. */
export function vine(
  length: number,
  amplitude: number,
  waves = 3,
): { path: string; buds: { x: number; y: number; angle: number; t: number }[] } {
  const seg = length / waves;
  let d = `M0 0`;
  for (let i = 0; i < waves; i++) {
    const x0 = i * seg;
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${r2(x0 + seg * 0.25)} ${r2(dir * amplitude)} ${r2(x0 + seg * 0.75)} ${r2(dir * amplitude)} ${r2(x0 + seg)} 0`;
  }
  const buds = Array.from({ length: waves * 2 }, (_, i) => {
    const t = (i + 0.5) / (waves * 2);
    const x = t * length;
    const dir = Math.floor(i / 2) % 2 === 0 ? -1 : 1;
    const y = dir * amplitude * 0.55;
    return { x: r2(x), y: r2(y), angle: dir < 0 ? -25 : 205, t };
  });
  return { path: d, buds };
}
