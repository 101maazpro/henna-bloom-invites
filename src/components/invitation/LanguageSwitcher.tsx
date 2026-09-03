import { useLanguage, type Language } from "@/lib/language";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="fixed right-4 top-4 z-40 flex items-center gap-1 border border-border bg-background/90 p-1 backdrop-blur-sm" aria-label={t.language}>
      {(["en", "hi", "te"] as Language[]).map((option) => (
        <button key={option} type="button" onClick={() => setLanguage(option)} aria-pressed={language === option} className={`px-2 py-1 font-sans text-[0.55rem] tracking-[0.14em] uppercase transition-colors ${language === option ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {option === "en" ? "EN" : option === "hi" ? "हिं" : "తె"}
        </button>
      ))}
    </div>
  );
}
