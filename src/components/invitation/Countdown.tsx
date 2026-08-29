import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CountRing } from "@/components/henna/Motifs";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso).getTime();
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setT(diff(target));
    const id = window.setInterval(() => setT(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-5">
      {units.map((u, i) => (
        <motion.div
          key={u.label}
          className="relative flex aspect-square items-center justify-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.15 * i, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <CountRing className="absolute inset-0 h-full w-full ink-line" delay={0.2 * i} />
          <div className="relative text-center">
            <div className="display-name text-[1.6rem] tabular-nums sm:text-4xl">
              {String(u.value).padStart(2, "0")}
            </div>
            <div className="eyebrow mt-0.5 text-[0.5rem] sm:text-[0.6rem]">{u.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
