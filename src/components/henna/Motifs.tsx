import { DrawCircle, DrawGroup, DrawPath, HennaStage } from "./Draw";
import { leaf, paisley, paisleyInner, petal, radial, ringDots, scallop, vine } from "@/lib/henna";

const HAIR = 1;

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

/** A paisley bud with inner echo, midrib dots and a leaf sprig. */
function PaisleyBud({
  transform,
  delay = 0,
  scale = 1,
  speed = 1,
}: {
  transform: string;
  delay?: number;
  scale?: number;
  speed?: number;
}) {
  return (
    <g transform={transform}>
      <DrawPath d={paisley(scale)} delay={delay} duration={1.6 * speed} strokeWidth={HAIR} />
      <DrawPath
        d={paisleyInner(scale)}
        delay={delay + 0.45}
        duration={1.2 * speed}
        strokeWidth={HAIR * 0.7}
        opacity={0.85}
      />
      {[0, 1, 2, 3].map((i) => (
        <DrawCircle
          key={i}
          mode="dot"
          cx={-6 * scale + i * 6 * scale}
          cy={-24 * scale - i * 7 * scale}
          r={1.5 * scale}
          delay={delay + 1 + i * 0.09}
          fill="currentColor"
          stroke="none"
        />
      ))}
      <g transform={`translate(${-4 * scale} ${-2 * scale}) rotate(-40)`}>
        <DrawPath
          d={leaf(20 * scale, 6 * scale)}
          delay={delay + 0.9}
          duration={0.9}
          strokeWidth={HAIR * 0.8}
        />
      </g>
    </g>
  );
}

/** A five petal henna flower. */
export function Flower({
  transform,
  delay = 0,
  r = 18,
  petals = 6,
}: {
  transform: string;
  delay?: number;
  r?: number;
  petals?: number;
}) {
  return (
    <g transform={transform}>
      {radial(petals, 0, 0, 0).map((p, i) => (
        <g key={i} transform={`rotate(${p.deg})`}>
          <DrawPath
            d={petal(r, r * 0.42)}
            delay={delay + i * 0.1}
            duration={0.8}
            strokeWidth={HAIR}
          />
        </g>
      ))}
      <DrawCircle
        cx={0}
        cy={0}
        r={r * 0.22}
        delay={delay + petals * 0.1}
        duration={0.6}
        strokeWidth={HAIR}
        stroke="currentColor"
      />
      <DrawCircle
        mode="dot"
        cx={0}
        cy={0}
        r={r * 0.09}
        delay={delay + petals * 0.1 + 0.2}
        fill="currentColor"
        stroke="none"
      />
    </g>
  );
}

/** Sinuous vine with alternating leaves. */
export function Vine({
  transform,
  length = 180,
  amplitude = 22,
  waves = 3,
  delay = 0,
  duration = 2.2,
}: {
  transform: string;
  length?: number;
  amplitude?: number;
  waves?: number;
  delay?: number;
  duration?: number;
}) {
  const v = vine(length, amplitude, waves);
  return (
    <g transform={transform}>
      <DrawPath d={v.path} delay={delay} duration={duration} strokeWidth={HAIR} />
      {v.buds.map((b, i) => (
        <g key={i}>
          <g transform={`translate(${b.x} ${b.y}) rotate(${b.angle})`}>
            <DrawPath
              d={leaf(16, 5.5)}
              delay={delay + duration * b.t * 0.9 + 0.25}
              duration={0.7}
              strokeWidth={HAIR * 0.8}
            />
          </g>
          <DrawCircle
            mode="dot"
            cx={b.x}
            cy={b.y * 1.9}
            r={1.4}
            delay={delay + duration * b.t * 0.9 + 0.6}
            fill="currentColor"
            stroke="none"
          />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Composite ornaments                                                 */
/* ------------------------------------------------------------------ */

/** Corner flourish: arc, paisley, filigree and dots. Drawn from the corner outward. */
function CornerFlourish({ delay = 0 }: { delay?: number }) {
  return (
    <g>
      <DrawPath
        d="M4 78 C 4 34 34 4 78 4"
        delay={delay}
        duration={1.5}
        strokeWidth={HAIR * 1.2}
      />
      <DrawPath
        d="M12 78 C 12 40 40 12 78 12"
        delay={delay + 0.25}
        duration={1.4}
        strokeWidth={HAIR * 0.6}
        opacity={0.75}
      />
      <PaisleyBud transform="translate(30 62) rotate(-45) scale(0.5)" delay={delay + 0.6} />
      <Flower transform="translate(72 30) scale(0.7)" delay={delay + 1.1} r={14} petals={5} />
      <Vine
        transform="translate(20 96) rotate(-8)"
        length={92}
        amplitude={12}
        waves={2}
        delay={delay + 1.2}
        duration={1.6}
      />
      {ringDots(6, 76, 16, 5, 0.2)
        .filter((d) => d.cx > 4 && d.cy > 4)
        .map((d) => (
          <DrawCircle
            key={d.key}
            mode="dot"
            cx={d.cx}
            cy={d.cy}
            r={1.6}
            delay={delay + 1.6}
            fill="currentColor"
            stroke="none"
          />
        ))}
    </g>
  );
}

/**
 * Rectangular ornamental frame that draws itself edge by edge, then grows
 * corner flourishes. Sits behind content via absolute positioning.
 */
export function OrnamentFrame({
  className = "",
  delay = 0,
  immediate = false,
}: {
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const W = 400;
  const H = 560;
  const m = 14;
  return (
    <HennaStage
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      immediate={immediate}
      amount={0.2}
    >
      <g stroke="currentColor" fill="none" vectorEffect="non-scaling-stroke">
        {/* the four edges draw outward from the centre of each side */}
        <DrawPath
          d={`M${W / 2} ${m} L${W - 90} ${m} M${W / 2} ${m} L90 ${m}`}
          delay={delay}
          duration={1.4}
          strokeWidth={HAIR}
        />
        <DrawPath
          d={`M${W / 2} ${H - m} L${W - 90} ${H - m} M${W / 2} ${H - m} L90 ${H - m}`}
          delay={delay + 0.15}
          duration={1.4}
          strokeWidth={HAIR}
        />
        <DrawPath
          d={`M${m} ${H / 2} L${m} ${H - 110} M${m} ${H / 2} L${m} 110`}
          delay={delay + 0.3}
          duration={1.6}
          strokeWidth={HAIR}
        />
        <DrawPath
          d={`M${W - m} ${H / 2} L${W - m} ${H - 110} M${W - m} ${H / 2} L${W - m} 110`}
          delay={delay + 0.45}
          duration={1.6}
          strokeWidth={HAIR}
        />
        {/* rounded corners */}
        <DrawPath
          d={`M90 ${m} C 45 ${m} ${m} 55 ${m} 110`}
          delay={delay + 1.3}
          duration={0.9}
          strokeWidth={HAIR}
        />
        <DrawPath
          d={`M${W - 90} ${m} C ${W - 45} ${m} ${W - m} 55 ${W - m} 110`}
          delay={delay + 1.4}
          duration={0.9}
          strokeWidth={HAIR}
        />
        <DrawPath
          d={`M90 ${H - m} C 45 ${H - m} ${m} ${H - 55} ${m} ${H - 110}`}
          delay={delay + 1.5}
          duration={0.9}
          strokeWidth={HAIR}
        />
        <DrawPath
          d={`M${W - 90} ${H - m} C ${W - 45} ${H - m} ${W - m} ${H - 55} ${W - m} ${H - 110}`}
          delay={delay + 1.6}
          duration={0.9}
          strokeWidth={HAIR}
        />
        {/* corner ornaments */}
        <g transform={`translate(${m} ${m})`}>
          <CornerFlourish delay={delay + 2.1} />
        </g>
        <g transform={`translate(${W - m} ${m}) scale(-1 1)`}>
          <CornerFlourish delay={delay + 2.25} />
        </g>
        <g transform={`translate(${m} ${H - m}) scale(1 -1)`}>
          <CornerFlourish delay={delay + 2.4} />
        </g>
        <g transform={`translate(${W - m} ${H - m}) scale(-1 -1)`}>
          <CornerFlourish delay={delay + 2.55} />
        </g>
        {/* crown motif */}
        <g transform={`translate(${W / 2} ${m})`}>
          <DrawPath
            d="M-46 0 C -30 -22 30 -22 46 0"
            delay={delay + 1.9}
            duration={0.8}
            strokeWidth={HAIR}
          />
          <Flower transform="translate(0 -16) scale(0.85)" delay={delay + 2.3} r={16} petals={7} />
          <DrawCircle
            mode="dot"
            cx={0}
            cy={-34}
            r={2}
            delay={delay + 3}
            fill="currentColor"
            stroke="none"
          />
        </g>
        <g transform={`translate(${W / 2} ${H - m}) scale(1 -1)`}>
          <DrawPath
            d="M-46 0 C -30 -22 30 -22 46 0"
            delay={delay + 2}
            duration={0.8}
            strokeWidth={HAIR}
          />
          <Flower transform="translate(0 -16) scale(0.7)" delay={delay + 2.5} r={14} petals={6} />
        </g>
      </g>
    </HennaStage>
  );
}

/** Horizontal separator: a vine that draws outward from a central flower. */
export function HennaDivider({ className = "" }: { className?: string }) {
  return (
    <HennaStage
      className={className}
      viewBox="0 0 320 60"
      preserveAspectRatio="xMidYMid meet"
      amount={0.6}
    >
      <g stroke="currentColor" fill="none">
        <Vine transform="translate(160 30)" length={140} amplitude={11} waves={3} delay={0.1} />
        <Vine
          transform="translate(160 30) scale(-1 1)"
          length={140}
          amplitude={11}
          waves={3}
          delay={0.1}
        />
        <Flower transform="translate(160 30)" delay={0.9} r={13} petals={8} />
        <DrawCircle mode="dot" cx={20} cy={30} r={2} delay={1.8} fill="currentColor" stroke="none" />
        <DrawCircle
          mode="dot"
          cx={300}
          cy={30}
          r={2}
          delay={1.8}
          fill="currentColor"
          stroke="none"
        />
      </g>
    </HennaStage>
  );
}

/** Delicate floral spray growing upward — used beside message blocks. */
export function FloralSpray({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <HennaStage className={className} viewBox="0 0 160 320" amount={0.25}>
      <g
        stroke="currentColor"
        fill="none"
        transform={flip ? "translate(160 0) scale(-1 1)" : undefined}
      >
        <DrawPath
          d="M20 316 C 44 250 24 190 52 138 C 74 96 66 52 96 14"
          delay={0}
          duration={2.6}
          strokeWidth={HAIR}
        />
        <DrawPath
          d="M22 300 C 60 268 62 232 54 196"
          delay={0.9}
          duration={1.4}
          strokeWidth={HAIR * 0.7}
          opacity={0.8}
        />
        <PaisleyBud transform="translate(56 214) rotate(18) scale(0.62)" delay={1.2} />
        <Flower transform="translate(96 96) scale(0.9)" delay={1.8} r={17} petals={6} />
        <Flower transform="translate(38 168) scale(0.6)" delay={2.2} r={15} petals={5} />
        <g transform="translate(70 264) rotate(35)">
          <DrawPath d={leaf(30, 10)} delay={1.6} duration={0.9} strokeWidth={HAIR * 0.8} />
        </g>
        <g transform="translate(34 120) rotate(-30)">
          <DrawPath d={leaf(26, 9)} delay={2.4} duration={0.9} strokeWidth={HAIR * 0.8} />
        </g>
        {[0, 1, 2, 3, 4].map((i) => (
          <DrawCircle
            key={i}
            mode="dot"
            cx={104 + i * 6}
            cy={40 - i * 9}
            r={1.8}
            delay={2.6 + i * 0.1}
            fill="currentColor"
            stroke="none"
          />
        ))}
      </g>
    </HennaStage>
  );
}

/** Arch (mihrab-like) ornament framing venue information. */
export function HennaArch({ className = "" }: { className?: string }) {
  return (
    <HennaStage className={className} viewBox="0 0 320 420" preserveAspectRatio="none" amount={0.2}>
      <g stroke="currentColor" fill="none">
        <DrawPath
          d="M28 416 L28 190 C 28 96 90 26 160 26 C 230 26 292 96 292 190 L292 416"
          delay={0}
          duration={3}
          strokeWidth={HAIR * 1.2}
        />
        <DrawPath
          d="M42 416 L42 194 C 42 106 96 42 160 42 C 224 42 278 106 278 194 L278 416"
          delay={0.5}
          duration={3}
          strokeWidth={HAIR * 0.6}
          opacity={0.7}
        />
        <DrawPath
          d={scallop(160, 190, 96, 16, 7)}
          delay={1.6}
          duration={2.4}
          strokeWidth={HAIR * 0.7}
          opacity={0.55}
        />
        <Flower transform="translate(160 62) scale(0.8)" delay={2.4} r={16} petals={8} />
        <PaisleyBud transform="translate(58 330) rotate(12) scale(0.6)" delay={2.6} />
        <PaisleyBud transform="translate(262 330) rotate(-12) scale(-0.6 0.6)" delay={2.8} />
        {ringDots(160, 190, 118, 18).map((d, i) =>
          d.cy < 300 ? (
            <DrawCircle
              key={d.key}
              mode="dot"
              cx={d.cx}
              cy={d.cy}
              r={1.7}
              delay={3 + i * 0.04}
              fill="currentColor"
              stroke="none"
            />
          ) : null,
        )}
      </g>
    </HennaStage>
  );
}

/** Ornamental corner brackets that draw around a photograph. */
export function PhotoOrnament({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <HennaStage className={className} viewBox="0 0 120 120" amount={0.3}>
      <g stroke="currentColor" fill="none" transform={flip ? "translate(120 0) scale(-1 1)" : undefined}>
        <DrawPath d="M2 114 C 2 52 52 2 114 2" delay={0} duration={1.4} strokeWidth={HAIR} />
        <DrawPath
          d="M14 114 C 14 60 60 14 114 14"
          delay={0.3}
          duration={1.3}
          strokeWidth={HAIR * 0.6}
          opacity={0.7}
        />
        <PaisleyBud transform="translate(44 78) rotate(-45) scale(0.42)" delay={0.7} />
        <Flower transform="translate(96 40) scale(0.5)" delay={1.2} r={14} petals={5} />
        <DrawCircle mode="dot" cx={26} cy={98} r={2} delay={1.6} fill="currentColor" stroke="none" />
      </g>
    </HennaStage>
  );
}

/** Small ring ornament for the countdown units. */
export function CountRing({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <HennaStage className={className} viewBox="0 0 120 120" amount={0.4}>
      <g stroke="currentColor" fill="none">
        <DrawCircle cx={60} cy={60} r={52} delay={delay} duration={1.6} strokeWidth={HAIR} />
        <DrawPath
          d={scallop(60, 60, 44, 12, 5)}
          delay={delay + 0.4}
          duration={1.8}
          strokeWidth={HAIR * 0.6}
          opacity={0.6}
        />
        {radial(6, 60, 60, 52).map((p, i) => (
          <g key={i} transform={`${p.transform} scale(0.5)`}>
            <DrawPath d={petal(16, 7)} delay={delay + 1.1 + i * 0.08} duration={0.6} strokeWidth={HAIR * 0.8} />
          </g>
        ))}
      </g>
    </HennaStage>
  );
}

/** The closing mandala: the visual climax where every motif converges. */
export function GrandMandala({ className = "" }: { className?: string }) {
  const c = 260;
  return (
    <HennaStage className={className} viewBox="0 0 520 520" amount={0.15}>
      <g stroke="currentColor" fill="none">
        {/* outer scalloped halo */}
        <DrawPath d={scallop(c, c, 236, 32, 10)} delay={0} duration={3.4} strokeWidth={HAIR} />
        <DrawCircle cx={c} cy={c} r={228} delay={0.6} duration={3} strokeWidth={HAIR * 0.6} opacity={0.6} />
        {/* radiating paisleys */}
        {radial(12, c, c, 178).map((p, i) => (
          <g key={`p${i}`} transform={`${p.transform} scale(0.62)`}>
            <PaisleyBud transform="translate(0 0)" delay={1.2 + i * 0.12} speed={0.8} />
          </g>
        ))}
        <DrawCircle cx={c} cy={c} r={152} delay={2.2} duration={2.4} strokeWidth={HAIR * 0.7} />
        <DrawPath d={scallop(c, c, 132, 20, 8)} delay={2.6} duration={2.4} strokeWidth={HAIR * 0.6} opacity={0.7} />
        {/* petal ring */}
        {radial(16, c, c, 108).map((p, i) => (
          <g key={`q${i}`} transform={p.transform}>
            <DrawPath d={petal(46, 17)} delay={3 + i * 0.07} duration={0.9} strokeWidth={HAIR * 0.8} />
          </g>
        ))}
        {radial(16, c, c, 112, 11.25).map((d, i) => (
          <DrawCircle
            key={`d${i}`}
            mode="dot"
            cx={d.x}
            cy={d.y}
            r={2}
            delay={4.2 + i * 0.04}
            fill="currentColor"
            stroke="none"
          />
        ))}
        <DrawCircle cx={c} cy={c} r={92} delay={4.4} duration={1.8} strokeWidth={HAIR * 0.8} />
        <DrawPath d={scallop(c, c, 78, 14, 6)} delay={4.7} duration={1.8} strokeWidth={HAIR * 0.6} opacity={0.7} />
        {/* connecting vines outward — the motifs joining up */}
        {radial(6, c, c, 236, 30).map((p, i) => (
          <g key={`v${i}`} transform={`${p.transform} rotate(90) scale(0.5)`}>
            <Vine transform="translate(0 0)" length={110} amplitude={16} waves={2} delay={5 + i * 0.1} duration={1.4} />
          </g>
        ))}
      </g>
    </HennaStage>
  );
}

/** Repeating paisley border strip used at section edges. */
export function BorderStrip({ className = "", count = 5 }: { className?: string; count?: number }) {
  const step = 320 / count;
  return (
    <HennaStage className={className} viewBox="0 0 320 70" preserveAspectRatio="xMidYMid meet" amount={0.5}>
      <g stroke="currentColor" fill="none">
        <DrawPath d="M0 62 L320 62" delay={0} duration={2} strokeWidth={HAIR * 0.6} opacity={0.6} />
        {Array.from({ length: count }, (_, i) => (
          <PaisleyBud
            key={i}
            transform={`translate(${step * i + step / 2} 62) scale(0.42)`}
            delay={0.4 + i * 0.18}
            speed={0.8}
          />
        ))}
      </g>
    </HennaStage>
  );
}
