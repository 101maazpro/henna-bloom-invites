import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flower } from "@/components/henna/Motifs";
import { HennaStage } from "@/components/henna/Draw";

type Attendance = "joyfully" | "regretfully";

export function Rsvp({ deadline }: { deadline: string }) {
  const [attendance, setAttendance] = useState<Attendance | null>(null);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {attendance ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-10 text-center"
          >
            <HennaStage className="mx-auto h-16 w-16 ink-line" viewBox="0 0 60 60" immediate>
              <g stroke="currentColor" fill="none">
                <Flower transform="translate(30 30)" delay={0.1} r={22} petals={8} />
              </g>
            </HennaStage>
            <p className="display-name mt-5 text-2xl">
              {attendance === "joyfully" ? "We’ll see you there" : "Thank you for letting us know"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {attendance === "joyfully"
                ? "Your presence will make our celebration even more special."
                : "You will be dearly missed, and held in our warmest thoughts."}
            </p>
            <button type="button" onClick={() => setAttendance(null)} className="mt-7 border-b border-accent pb-1 font-sans text-[0.6rem] tracking-[0.3em] text-primary uppercase">
              Change response
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-7 text-center"
          >
            <p className="mx-auto max-w-[18rem] font-display text-lg leading-relaxed text-muted-foreground">
              We would be honoured to celebrate this beautiful day with you.
            </p>
            <div className="flex gap-3">
                {(
                  [
                    ["joyfully", "Will Be There"],
                    ["regretfully", "Regretfully decline"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAttendance(value)}
                    className={`flex-1 border px-3 py-2.5 font-display text-sm tracking-wide transition-colors ${
                      attendance === value
                        ? "border-accent bg-secondary text-foreground"
                        : "border-border text-muted-foreground hover:border-accent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Kindly respond by {deadline}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
