import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { wedding, type WeddingData } from "@/data/wedding";
import { createAmbience } from "@/lib/ambient-music";
import { Countdown } from "@/components/invitation/Countdown";
import { OpenGate } from "@/components/invitation/OpenGate";
import { MusicToggle } from "@/components/invitation/MusicToggle";
import { Rsvp } from "@/components/invitation/Rsvp";
import { SocialIcons } from "@/components/invitation/SocialIcons";
import { LanguageSwitcher } from "@/components/invitation/LanguageSwitcher";
import { LanguageProvider, useLanguage, type Language } from "@/lib/language";
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
      { title: "Henna Bloom Invites" },
      {
        name: "description",
        content:
          "A hand-drawn mehendi wedding invitation.",
      },
      { property: "og:title", content: "Henna Bloom Invites" },
      {
        property: "og:description",
        content:
          "Open a private wedding invitation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootLanding,
});

/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const WeddingContext = createContext<WeddingData>(wedding);
const useWedding = () => useContext(WeddingContext);

function RootLanding() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <p className="eyebrow">Henna Bloom Invites</p>
        <h1 className="display-name mt-4 text-4xl">Your invitation awaits</h1>
        <p className="mt-3 text-sm text-muted-foreground">Open the invitation using its private link.</p>
      </div>
    </main>
  );
}

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

export function Invitation({ data = wedding }: { data?: WeddingData }) {
  const d = data;
  const reduced = useReducedMotion() ?? false;
  const [language, setLanguage] = useState<Language>("en");
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ambience = useMemo(() => createAmbience(), []);
  const audio = useMemo(() => (d.music.url ? new Audio(d.music.url) : null), [d.music.url]);

  useEffect(() => () => {
    ambience.dispose();
    if (audio) {
      audio.pause();
      audio.src = "";
    }
  }, [ambience, audio]);

  const startMusic = async () => {
    if (audio) return audio.play();
    return ambience.start();
  };

  const stopMusic = () => {
    if (audio) audio.pause();
    else ambience.stop();
  };

  const onOpen = () => {
    setOpened(true);
    if (d.music.enabled) {
      void startMusic().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const toggleMusic = () => {
    if (playing) {
      stopMusic();
      setPlaying(false);
    } else {
      void startMusic().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
    <WeddingContext.Provider value={d}>
      <LanguageSwitcher />
    <main className="paper-grain paper-vignette relative min-h-screen overflow-x-hidden bg-background">
      <OpenGate groom={d.couple.groom} bride={d.couple.bride} onOpen={onOpen} />
      {d.music.enabled && opened && (
        <MusicToggle playing={playing} onToggle={toggleMusic} label={d.music.label} />
      )}

      <Hero />
      {(d.message.kicker || d.message.body || d.message.closing) && <MessageSection />}
      {d.profiles && <CoupleSection />}
      <CountdownSection />
      {d.events.length > 0 && <EventsSection />}
      <VenueSection />
      {d.gallery.length > 0 && <GallerySection reduced={reduced} />}
      <RsvpSection />
      <Finale />
    </main>
    </WeddingContext.Provider>
    </LanguageProvider>
  );
}

/* ---------------------------- 1. HERO ----------------------------- */

function Hero() {
  const d = useWedding();
  const { t } = useLanguage();
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
            {t.weddingOf}
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
          <span className="eyebrow text-[0.55rem]">{t.scroll}</span>
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
  const d = useWedding();
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

function CoupleSection() {
  const d = useWedding();
  const profiles = d.profiles;
  if (!profiles) return null;
  const people = [
    { name: d.couple.groom, profile: profiles.groom },
    { name: d.couple.bride, profile: profiles.bride },
  ];

  return (
    <Section className="relative py-20">
      <div className="text-center"><Eyebrow>With their families</Eyebrow></div>
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        {people.map(({ name, profile }) => (
          <Reveal key={name} className="text-center">
            {profile.photoUrl && <img src={profile.photoUrl} alt={name} loading="lazy" className="mx-auto aspect-[4/5] w-44 border border-border object-cover" />}
            <h2 className="display-name mt-5 text-3xl">{name}</h2>
            {profile.qualification && <p className="mt-2 font-display text-sm text-muted-foreground">{profile.qualification}</p>}
            {profile.occupation && <p className="font-display text-sm text-muted-foreground">{profile.occupation}</p>}
            {profile.parents && <p className="mt-3 font-display text-sm text-foreground/80">{profile.parents}</p>}
          </Reveal>
        ))}
      </div>
      {profiles.relatives && <Reveal><p className="mx-auto mt-10 max-w-sm text-center font-display text-sm text-muted-foreground">{profiles.relatives}</p></Reveal>}
    </Section>
  );
}

/* ------------------------- 3. COUNTDOWN --------------------------- */

function CountdownSection() {
  const d = useWedding();
  const { t } = useLanguage();
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
        <Eyebrow>{t.counting}</Eyebrow>
        <Reveal delay={0.15}>
          <p className="display-name mt-4 text-2xl">{t.untilNikah}</p>
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
  const d = useWedding();
  const { t } = useLanguage();
  return (
    <Section className="relative py-20">
      <div className="text-center">
        <Eyebrow>{t.celebrations}</Eyebrow>
        <Reveal delay={0.1}>
          <h2 className="display-name mt-4 text-4xl">{t.events}</h2>
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
                  {t.location}
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
  const d = useWedding();
  const { t } = useLanguage();
  return (
    <Section className="relative py-24">
      <div className="relative mx-auto flex min-h-[420px] max-w-[330px] items-center justify-center">
        <HennaArch className="pointer-events-none absolute inset-0 h-full w-full ink-line" />
        <div className="relative px-10 pt-14 text-center">
          <Eyebrow>{t.venue}</Eyebrow>
          <Reveal delay={0.15}>
            <h2 className="display-name mt-4 text-[1.9rem] leading-tight">{d.venue.name}</h2>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-4 font-display text-base text-muted-foreground">{d.venue.address}</p>
            <p className="font-sans text-[0.68rem] tracking-[0.24em] text-muted-foreground uppercase">
              {d.venue.city}
            </p>
          </Reveal>
          {d.venue.mapsUrl && <Reveal delay={0.35}>
            <a
              href={d.venue.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-block border border-accent px-6 py-3 font-sans text-[0.6rem] tracking-[0.36em] text-primary uppercase transition-colors hover:bg-secondary"
            >
              {t.directions}
            </a>
          </Reveal>}
          {d.venue.imageUrl && <img src={d.venue.imageUrl} alt={d.venue.name || "Venue"} loading="lazy" className="mx-auto mt-8 max-h-44 w-full object-cover" />}
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
  image: WeddingData["gallery"][number];
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
  const d = useWedding();
  const { t } = useLanguage();
  return (
    <Section className="relative py-20">
      <div className="text-center">
        <Eyebrow>{t.moments}</Eyebrow>
        <Reveal delay={0.1}>
          <h2 className="display-name mt-4 text-4xl">{t.gallery}</h2>
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
  const d = useWedding();
  const { t } = useLanguage();
  return (
    <Section className="relative py-20">
      <div className="relative">
        <OrnamentFrame className="pointer-events-none absolute -inset-x-4 -inset-y-8 h-[calc(100%+4rem)] w-[calc(100%+2rem)] ink-line" />
        <div className="relative px-4 py-10">
          <div className="text-center">
            <Eyebrow>{t.respond}</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="display-name mt-4 text-4xl">{t.rsvp}</h2>
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
  const d = useWedding();
  const { t } = useLanguage();
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
