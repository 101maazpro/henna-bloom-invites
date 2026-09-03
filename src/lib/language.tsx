import { createContext, useContext, type ReactNode } from "react";

export type Language = "en" | "hi" | "te";

const labels = {
  en: { weddingOf: "The wedding of", open: "Open Invitation", scroll: "Scroll", counting: "Counting the days", untilNikah: "until the Nikah", celebrations: "Celebrations", events: "The Events", venue: "The Venue", moments: "Moments", gallery: "Us, so far", respond: "Kindly respond", rsvp: "RSVP", scan: "Scan to RSVP", directions: "Get directions", location: "View location", language: "Language" },
  hi: { weddingOf: "विवाह समारोह", open: "निमंत्रण खोलें", scroll: "स्क्रॉल करें", counting: "दिन गिन रहे हैं", untilNikah: "निकाह तक", celebrations: "उत्सव", events: "कार्यक्रम", venue: "स्थान", moments: "यादें", gallery: "हमारी कहानी", respond: "कृपया उत्तर दें", rsvp: "आरएसवीपी", scan: "आरएसवीपी के लिए स्कैन करें", directions: "दिशा देखें", location: "स्थान देखें", language: "भाषा" },
  te: { weddingOf: "వివాహ వేడుక", open: "ఆహ్వానాన్ని తెరవండి", scroll: "స్క్రోల్ చేయండి", counting: "రోజులను లెక్కిస్తున్నాం", untilNikah: "నికాహ్ వరకు", celebrations: "వేడుకలు", events: "కార్యక్రమాలు", venue: "వేదిక", moments: "జ్ఞాపకాలు", gallery: "మన కథ", respond: "దయచేసి స్పందించండి", rsvp: "ఆర్‌ఎస్‌వీపీ", scan: "ఆర్‌ఎస్‌వీపీ కోసం స్కాన్ చేయండి", directions: "దారి చూపండి", location: "స్థానం చూడండి", language: "భాష" },
} as const;

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: "en", setLanguage: () => {} });

export function LanguageProvider({ language, setLanguage, children }: { language: Language; setLanguage: (language: Language) => void; children: ReactNode }) {
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const { language, setLanguage } = useContext(LanguageContext);
  return { language, setLanguage, t: labels[language] };
}
