import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HennaStage, DrawCircle, DrawPath } from "@/components/henna/Draw";
import { Flower } from "@/components/henna/Motifs";
import { radial, scallop, petal } from "@/lib/henna";

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
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 1.1, ease: [0.5, 0, 0.2, 1] }}
        >
          <HennaStage className="h-52 w-52 ink-line sm:h-64 sm:w-64" viewBox="0 0 200 200" immediate>
            <g stroke="currentColor" fill="none">
              <DrawPath d={scallop(100, 100, 80, 20, 6)} delay={0.2} duration={2.4} strokeWidth={1} />
              <DrawCircle cx={100} cy={100} r={64} delay={0.8} duration={1.8} strokeWidth={0.7} opacity={0.7} />
              {radial(10, 100, 100, 46).map((p, i) => (
                <g key={i} transform={p.transform}>
                  <DrawPath d={petal(30, 11)} delay={1.4 + i * 0.08} duration={0.7} strokeWidth={0.8} />
                </g>
              ))}
              <Flower transform="translate(100 100) scale(0.8)" delay={2.3} r={18} petals={6} />
            </g>
          </HennaStage>

          <motion.p
            className="eyebrow mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 1 }}
          >
            The wedding of
          </motion.p>
          <motion.h2
            className="display-name mt-3 text-center text-3xl sm:text-4xl"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 2.9, duration: 1.4 }}
          >
            {groom} <span className="text-accent">&</span> {bride}
          </motion.h2>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 1 }}
            onClick={() => {
              onOpen();
              setOpen(true);
            }}
            className="mt-10 border border-accent px-8 py-3.5 font-sans text-[0.65rem] tracking-[0.45em] text-foreground uppercase transition-colors hover:bg-secondary"
          >
            Open Invitation
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
