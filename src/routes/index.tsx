import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { wedding } from "@/data/wedding";
import { createAmbience } from "@/lib/ambient-music";
import { Countdown } from "@/components/invitation/Countdown";
import { OpenGate } from "@/components/invitation/OpenGate";
import { MusicToggle } from "@/components/invitation/MusicToggle";
import { Rsvp } from "@/components/invitation/Rsvp";
import { SocialIcons } from "@/components/invitation/SocialIcons";
import {
  BorderStrip,
  FloralSpray,
  GrandMandala,
  HennaArch,
  HennaDivider,
  OrnamentFrame,
  PhotoOrnament,
  Vine,
} from "@/components/henna/Motifs";
import { HennaStage } from "@/components/henna/Draw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ahmed & Ayesha — 14 December 2026 | Mehendi Wedding Invitation" },
      {
        name: "description",
        content:
          "A hand-drawn mehendi wedding invitation for Ahmed & Ayesha in Hyderabad, 14 December 2026. Events, venue, countdown and RSVP.",
      },
      { property: "og:title", content: "Ahmed & Ayesha — Wedding Invitation" },
      {
        property: "og:description",
        content:
          "Together with their families, Ahmed & Ayesha invite you to celebrate their special day in Hyderabad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-[430px] px-7 ${className}`}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <p className="eyebrow text-center">{children}</p>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

function Invitation() {
  const d = wedding;
  const reduced = useReducedMotion() ?? false;
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ambience = useMemo(() => createAmbience(), []);

  useEffect(() => () => ambience.dispose(), [ambience]);

  const onOpen = () => {
    setOpened(true);
    if (d.music.enabled) {
      void ambience.start();
      setPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (playing) {
      ambience.stop();
      setPlaying(false);
    } else {
      void ambience.start();
      setPlaying(true);
    }
  };

  return (
    <main className="paper-grain paper-vignette relative min-h-screen overflow-x-hidden bg-background">
      <OpenGate groom={d.couple.groom} bride={d.couple.bride} onOpen={onOpen} />
      {d.music.enabled && opened && (
        <MusicToggle playing={playing} onToggle={toggleMusic} label={d.music.label} />
      )}

      <Hero />
      <MessageSection />
      <CountdownSection />
      <EventsSection />
      <VenueSection />
      <GallerySection reduced={reduced} />
      <RsvpSection />
      <Finale />
    </main>
  );
}

/* ---------------------------- 1. HERO ----------------------------- */

function Hero() {
  const d = wedding;
  const inv = d.invocation;
  const fontClass =
    inv.font === "arabic"
      ? "font-arabic"
      : inv.font === "devanagari"
        ? "font-devanagari"
        : "font-display";

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center px-6 pt-16 pb-24">
      <div className="relative w-full max-w-[380px]">
        <OrnamentFrame
          className="pointer-events-none absolute -inset-x-2 -inset-y-10 h-[calc(100%+5rem)] w-[calc(100%+1rem)] ink-line"
          immediate
          delay={0.4}
        />

        <div className="relative px-6 py-14 text-center">
          {inv.kind !== "none" && inv.text && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 3.4, duration: 1.6 }}
              dir={inv.dir}
              className="mb-9"
            >
              <p className={`${fontClass} text-[1.05rem] leading-loose text-primary sm:text-xl`}>
                {inv.text}
              </p>
              {inv.translation && (
                <p
                  dir="ltr"
                  className="mx-auto mt-3 max-w-[19rem] font-display text-[0.78rem] tracking-wide text-muted-foreground italic"
                >
                  {inv.translation}
                </p>
              )}
            </motion.div>
          )}

          <motion.p
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2, duration: 1.2 }}
          >
            The wedding of
          </motion.p>

          <motion.h1
            className="mt-5 flex flex-col items-center"
            initial={{ opacity: 0, filter: "blur(14px)", scale: 0.97 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ delay: 4.5, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="display-name text-[3.1rem] sm:text-6xl">{d.couple.groom}</span>
            <span className="my-1.5 font-display text-2xl text-accent italic">
              {d.couple.joiner}
            </span>
            <span className="display-name text-[3.1rem] sm:text-6xl">{d.couple.bride}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.6, duration: 1.2 }}
            className="mt-8"
          >
            <div className="rule-gold mx-auto w-28" />
            <p className="mt-4 font-sans text-[0.68rem] tracking-[0.38em] text-foreground uppercase">
              {d.headlineDate}
            </p>
            <p className="mt-2 font-display text-sm text-muted-foreground italic">
              {d.venue.city.split(",")[0]}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.6, duration: 1.4 }}
          className="absolute -bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="eyebrow text-[0.55rem]">Scroll</span>
          <motion.span
            className="block h-10 w-px bg-border"
            animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------- 2. MESSAGE ---------------------------- */

function MessageSection() {
  const d = wedding;
  return (
    <Section className="relative py-24">
      <FloralSpray className="pointer-events-none absolute -left-6 top-6 h-64 w-32 ink-line opacity-70 sm:-left-16" />
      <FloralSpray
        className="pointer-events-none absolute -right-6 bottom-0 h-64 w-32 ink-line opacity-70 sm:-right-16"
        flip
      />
      <div className="relative text-center">
        <Eyebrow>{d.message.kicker}</Eyebrow>
        <Reveal delay={0.15}>
          <p className="display-name mt-6 text-3xl sm:text-4xl">
            {d.couple.groom} <span className="text-accent">{d.couple.joiner}</span>{" "}
            {d.couple.bride}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-[17rem] font-display text-lg leading-relaxed text-muted-foreground">
            {d.message.body}
          </p>
        </Reveal>
        <HennaDivider className="mx-auto mt-10 h-14 w-full max-w-[280px] ink-line" />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-[19rem] font-display text-[0.95rem] leading-relaxed text-foreground/80 italic">
            {d.message.closing}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------- 3. COUNTDOWN --------------------------- */

function CountdownSection() {
  const d = wedding;
  return (
    <Section className="relative py-20">
      <HennaStage className="pointer-events-none absolute inset-x-0 -top-2 h-16 w-full ink-line" viewBox="0 0 320 60">
        <g stroke="currentColor" fill="none">
          <Vine transform="translate(160 30)" length={150} amplitude={10} waves={3} delay={0} />
          <Vine
            transform="translate(160 30) scale(-1 1)"
            length={150}
            amplitude={10}
            waves={3}
            delay={0.2}
          />
        </g>
      </HennaStage>
      <div className="text-center">
        <Eyebrow>Counting the days</Eyebrow>
        <Reveal delay={0.15}>
          <p className="display-name mt-4 text-2xl">until the Nikah</p>
        </Reveal>
      </div>
      <div className="mt-10">
        <Countdown iso={d.weddingISO} />
      </div>
      <BorderStrip className="mx-auto mt-12 h-14 w-full ink-line" count={5} />
    </Section>
  );
}

/* --------------------------- 4. EVENTS ---------------------------- */

function EventsSection() {
  const d = wedding;
  return (
    <Section className="relative py-20">
      <div className="text-center">
        <Eyebrow>Celebrations</Eyebrow>
        <Reveal delay={0.1}>
          <h2 className="display-name mt-4 text-4xl">The Events</h2>
        </Reveal>
      </div>

      <ul className="mt-14 space-y-16">
        {d.events.map((ev, i) => (
          <li key={ev.id} className="relative">
            <FloralSpray
              className={`pointer-events-none absolute ${
                i % 2 === 0 ? "-left-8" : "-right-8"
              } -top-6 h-44 w-24 ink-line opacity-55`}
              flip={i % 2 !== 0}
            />
            <Reveal className="relative text-center">
              <p className="display-name text-[2.1rem] tracking-[0.04em]">{ev.name}</p>
              <div className="rule-gold mx-auto mt-3 w-16" />
              <p className="mt-4 font-sans text-[0.65rem] tracking-[0.34em] text-foreground uppercase">
                {ev.date}
              </p>
              <p className="mt-1.5 font-display text-xl text-primary">{ev.time}</p>
              <p className="mt-3 font-display text-base text-foreground">{ev.venue}</p>
              <p className="font-sans text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
                {ev.city}
              </p>
              {ev.note && (
                <p className="mt-2 font-display text-sm text-muted-foreground italic">{ev.note}</p>
              )}
              {ev.mapsUrl && (
                <a
                  href={ev.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-block border-b border-accent pb-1 font-sans text-[0.6rem] tracking-[0.36em] text-primary uppercase transition-opacity hover:opacity-70"
                >
                  View location
                </a>
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------- 5. VENUE ---------------------------- */

function VenueSection() {
  const d = wedding;
  return (
    <Section className="relative py-24">
      <div className="relative mx-auto flex min-h-[420px] max-w-[330px] items-center justify-center">
        <HennaArch className="pointer-events-none absolute inset-0 h-full w-full ink-line" />
        <div className="relative px-10 pt-14 text-center">
          <Eyebrow>The Venue</Eyebrow>
          <Reveal delay={0.15}>
            <h2 className="display-name mt-4 text-[1.9rem] leading-tight">{d.venue.name}</h2>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-4 font-display text-base text-muted-foreground">{d.venue.address}</p>
            <p className="font-sans text-[0.68rem] tracking-[0.24em] text-muted-foreground uppercase">
              {d.venue.city}
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <a
              href={d.venue.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-block border border-accent px-6 py-3 font-sans text-[0.6rem] tracking-[0.36em] text-primary uppercase transition-colors hover:bg-secondary"
            >
              Get directions
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------- 6. GALLERY ---------------------------- */

function GalleryImage({
  image,
  index,
  reduced,
}: {
  image: (typeof wedding)["gallery"][number];
  index: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [26, -26]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.06, 1.14]);
  const odd = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`relative ${image.span === "tall" ? "w-[78%]" : "w-[88%]"} ${
        odd ? "ml-auto" : "mr-auto"
      }`}
    >
      <PhotoOrnament
        className={`pointer-events-none absolute -top-7 ${
          odd ? "-right-7" : "-left-7"
        } z-10 h-20 w-20 ink-line`}
        flip={odd}
      />
      <PhotoOrnament
        className={`pointer-events-none absolute -bottom-7 ${
          odd ? "-left-7" : "-right-7"
        } z-10 h-20 w-20 rotate-180 ink-line`}
        flip={odd}
      />
      <motion.div
        style={{ y }}
        className="relative overflow-hidden border border-border"
      >
        <motion.img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          style={{ scale }}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-primary/5 mix-blend-multiply" />
      </motion.div>
    </div>
  );
}

function GallerySection({ reduced }: { reduced: boolean }) {
  const d = wedding;
  return (
    <Section className="relative py-20">
      <div className="text-center">
        <Eyebrow>Moments</Eyebrow>
        <Reveal delay={0.1}>
          <h2 className="display-name mt-4 text-4xl">Us, so far</h2>
        </Reveal>
      </div>
      <div className="mt-16 space-y-20">
        {d.gallery.map((img, i) => (
          <GalleryImage key={img.src} image={img} index={i} reduced={reduced} />
        ))}
      </div>
      <HennaDivider className="mx-auto mt-20 h-14 w-full max-w-[280px] ink-line" />
    </Section>
  );
}

/* ---------------------------- 7. RSVP ----------------------------- */

function RsvpSection() {
  const d = wedding;
  return (
    <Section className="relative py-20">
      <div className="relative">
        <OrnamentFrame className="pointer-events-none absolute -inset-x-4 -inset-y-8 h-[calc(100%+4rem)] w-[calc(100%+2rem)] ink-line" />
        <div className="relative px-4 py-10">
          <div className="text-center">
            <Eyebrow>Kindly respond</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="display-name mt-4 text-4xl">RSVP</h2>
            </Reveal>
          </div>
          <div className="mt-10">
            <Rsvp deadline={d.rsvpDeadline} />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------- 8. FINALE ---------------------------- */

function Finale() {
  const d = wedding;
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-20">
      <div className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center">
        <GrandMandala className="pointer-events-none absolute inset-0 h-full w-full ink-line" />
        <div className="relative max-w-[58%] text-center">
          <p className="display-name text-[1.7rem] leading-tight sm:text-3xl">
            {d.couple.groom}
            <span className="mx-1.5 text-accent">{d.couple.joiner}</span>
            {d.couple.bride}
          </p>
          <div className="rule-gold mx-auto mt-4 w-16" />
          <p className="mt-4 font-sans text-[0.55rem] leading-[1.9] tracking-[0.3em] text-muted-foreground uppercase sm:text-[0.62rem]">
            {d.finale.title}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[430px] text-center">
        <Reveal>
          <p className="font-display text-base text-muted-foreground italic">{d.finale.note}</p>
        </Reveal>

        {d.finale.qr && (
          <Reveal delay={0.15}>
            <div className="mx-auto mt-9 flex h-24 w-24 items-center justify-center border border-border p-2">
              <div className="grid h-full w-full grid-cols-6 gap-[2px] opacity-70">
                {Array.from({ length: 36 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      [0, 1, 2, 6, 8, 12, 13, 14, 3, 5, 9, 17, 21, 22, 28, 30, 33, 34, 35].includes(
                        i,
                      )
                        ? "bg-primary"
                        : ""
                    }
                  />
                ))}
              </div>
            </div>
            <p className="eyebrow mt-3 text-[0.5rem]">Scan to RSVP</p>
          </Reveal>
        )}

        <Reveal delay={0.2}>
          <div className="mt-10">
            <SocialIcons links={d.social} />
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="eyebrow mt-12 text-[0.5rem]">
            {d.couple.groom} {d.couple.joiner} {d.couple.bride} · {d.headlineDate}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
