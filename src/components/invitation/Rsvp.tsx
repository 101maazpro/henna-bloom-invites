import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flower } from "@/components/henna/Motifs";
import { HennaStage } from "@/components/henna/Draw";

type Attendance = "joyfully" | "regretfully";

const fieldClass =
  "w-full border-0 border-b border-border bg-transparent px-0 py-2.5 font-display text-lg text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors";

export function Rsvp({ deadline }: { deadline: string }) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("joyfully");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSent(true);
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
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
            <p className="display-name mt-5 text-2xl">Shukriya, {name.split(" ")[0]}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {attendance === "joyfully"
                ? `We have noted ${guests} ${guests === 1 ? "seat" : "seats"} in your name.`
                : "You will be dearly missed — thank you for letting us know."}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-7 text-left"
          >
            <div>
              <label htmlFor="rsvp-name" className="eyebrow">
                Your name
              </label>
              <input
                id="rsvp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name as it appears on your invitation"
                className={fieldClass}
                required
              />
            </div>

            <fieldset>
              <legend className="eyebrow">Will you attend</legend>
              <div className="mt-3 flex gap-3">
                {(
                  [
                    ["joyfully", "Joyfully accept"],
                    ["regretfully", "Regretfully decline"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAttendance(value)}
                    aria-pressed={attendance === value}
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
            </fieldset>

            <div>
              <label htmlFor="rsvp-guests" className="eyebrow">
                Number of guests
              </label>
              <div className="mt-3 flex items-center gap-5">
                <button
                  type="button"
                  aria-label="Fewer guests"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="h-9 w-9 border border-border font-display text-lg text-foreground transition-colors hover:border-accent"
                >
                  −
                </button>
                <span id="rsvp-guests" className="display-name text-2xl tabular-nums">
                  {guests}
                </span>
                <button
                  type="button"
                  aria-label="More guests"
                  onClick={() => setGuests((g) => Math.min(12, g + 1))}
                  className="h-9 w-9 border border-border font-display text-lg text-foreground transition-colors hover:border-accent"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="rsvp-message" className="eyebrow">
                A note for the couple
              </label>
              <textarea
                id="rsvp-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Blessings, wishes, a couplet…"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full border border-accent bg-primary px-6 py-3.5 font-sans text-[0.7rem] tracking-[0.4em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
            >
              Send RSVP
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Kindly respond by {deadline}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
