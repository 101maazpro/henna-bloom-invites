import { motion } from "motion/react";

export function MusicToggle({
  playing,
  onToggle,
  label,
}: {
  playing: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="fixed right-3 bottom-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-primary backdrop-blur-sm transition-colors hover:border-accent sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2">
        {playing ? (
          <>
            <path d="M9 5v14M15 5v14" strokeLinecap="round" />
          </>
        ) : (
          <path d="M8 5.5v13l11-6.5-11-6.5Z" strokeLinejoin="round" />
        )}
      </svg>
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-full border border-accent"
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </motion.button>
  );
}
