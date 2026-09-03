import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  HennaStage,
  DrawCircle,
  DrawPath,
} from "@/components/henna/Draw";
import { Flower } from "@/components/henna/Motifs";
import { radial, ringDots, scallop, petal, r2 } from "@/lib/henna";
import { useLanguage } from "@/lib/language";

/**
 * The cover ornament — a complete, continuous mehendi medallion
 * drawn stroke by stroke:
 *
 * - outer scalloped halo
 * - outer dot ring
 * - two circular rings
 * - full ring of overlapping petals
 * - inner echo petals
 * - inner scallop
 * - inner dot ring
 * - inner petal ring
 * - central flower
 */
function CoverMedallion() {
  const c = 130;

  return (
    <HennaStage
      className="h-60 w-60 ink-line sm:h-72 sm:w-72"
      viewBox="0 0 260 260"
      immediate
    >
      <g stroke="currentColor" fill="none">
        {/* Outer halo */}
        <DrawPath
          d={scallop(c, c, 122, 28, 9)}
          delay={0.1}
          duration={3}
          strokeWidth={1}
        />

        {/* Outer dot ring */}
        {ringDots(c, c, 110, 28, 0.5).map((d, i) => (
          <DrawCircle
            key={d.key}
            mode="dot"
            cx={d.cx}
            cy={d.cy}
            r={1.6}
            delay={2.2 + i * 0.05}
            fill="currentColor"
            stroke="none"
          />
        ))}

        {/* Outer circular ring */}
        <DrawCircle
          cx={c}
          cy={c}
          r={100}
          delay={0.9}
          duration={2.6}
          strokeWidth={0.9}
        />

        {/* Petal ring — full circle of overlapping petals */}
        {radial(20, c, c, 78).map((p, i) => (
          <g key={`outer-petal-${i}`} transform={p.transform}>
            <DrawPath
              d={petal(30, 13)}
              delay={1.4 + i * 0.07}
              duration={0.65}
              strokeWidth={0.9}
            />

            {/* Inner echo inside each petal */}
            <DrawPath
              d={petal(20, 8)}
              delay={1.7 + i * 0.07}
              duration={0.5}
              strokeWidth={0.5}
              opacity={0.6}
            />
          </g>
        ))}

        {/* Petal-ring boundary */}
        <DrawCircle
          cx={c}
          cy={c}
          r={76}
          delay={1.3}
          duration={2.2}
          strokeWidth={0.6}
          opacity={0.7}
        />

        {/* Inner scallop */}
        <DrawPath
          d={scallop(c, c, 58, 16, 6)}
          delay={2.7}
          duration={2}
          strokeWidth={0.7}
        />

        {/* Inner dot ring */}
        {ringDots(c, c, 48, 12).map((d) => (
          <DrawCircle
            key={`inner-dot-${d.key}`}
            mode="dot"
            cx={d.cx}
            cy={d.cy}
            r={1.8}
            delay={3.4}
            fill="currentColor"
            stroke="none"
          />
        ))}

        {/* Inner petal ring */}
        {radial(8, c, c, 34, 22.5).map((p, i) => (
          <g key={`inner-petal-${i}`} transform={p.transform}>
            <DrawPath
              d={petal(22, 10)}
              delay={3.6 + i * 0.1}
              duration={0.6}
              strokeWidth={0.8}
            />
          </g>
        ))}

        {/* Inner boundary */}
        <DrawCircle
          cx={c}
          cy={c}
          r={30}
          delay={3.5}
          duration={1.4}
          strokeWidth={0.6}
          opacity={0.7}
        />

        {/* Central flower */}
        <Flower
          transform={`translate(${c} ${c})`}
          delay={4.3}
          r={r2(18)}
          petals={6}
        />
      </g>
    </HennaStage>
  );
}

export function OpenGate({
  groom,
  bride,
  onOpen,
}: {
  groom: string;
  bride: string;
  onOpen: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = open ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className="paper-grain fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-8"
          exit={{
            opacity: 0,
            filter: "blur(6px)",
          }}
          transition={{
            duration: 1.1,
            ease: [0.5, 0, 0.2, 1],
          }}
        >
          {/* Detailed mehendi medallion */}
          <CoverMedallion />

          {/* Wedding label */}
          <motion.p
            className="eyebrow mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 3.2,
              duration: 1,
            }}
          >
            {t.weddingOf}
          </motion.p>

          {/* Couple names */}
          <motion.h2
            className="display-name mt-3 text-center text-3xl sm:text-4xl"
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
            }}
            transition={{
              delay: 3.5,
              duration: 1.4,
            }}
          >
            {groom}{" "}
            <span className="text-accent">&</span>{" "}
            {bride}
          </motion.h2>

          {/* Open invitation */}
          <motion.button
            type="button"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 4.2,
              duration: 1,
            }}
            onClick={() => {
              onOpen();
              setOpen(true);
            }}
            className="mt-10 border border-accent px-8 py-3.5 font-sans text-[0.65rem] tracking-[0.45em] text-foreground uppercase transition-colors hover:bg-secondary"
          >
            {t.open}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}