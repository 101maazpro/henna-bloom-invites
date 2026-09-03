import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";
import couple4 from "@/assets/couple-4.jpg";

export type InvocationKind = "allah" | "om" | "jesus" | "ram" | "custom" | "none";

export interface Invocation {
  kind: InvocationKind;
  /** Script text shown large (Arabic / Devanagari / Latin). */
  text: string;
  /** Optional transliteration or translation shown beneath. */
  translation?: string;
  dir: "rtl" | "ltr";
  /** font stack key defined in styles.css */
  font: "arabic" | "devanagari" | "serif";
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string; // display
  time: string;
  venue: string;
  city: string;
  mapsUrl?: string;
  note?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  span: "tall" | "wide";
}

export interface InvitationContact {
  name: string;
  phone: string;
  whatsappUrl: string;
}

export interface WeddingData {
  couple: { groom: string; bride: string; joiner: string };
  profiles?: { groom: PersonProfile; bride: PersonProfile; relatives: string };
  invocation: Invocation;
  headlineDate: string;
  /** ISO datetime used by the countdown */
  weddingISO: string;
  message: { kicker: string; body: string; closing: string };
  events: WeddingEvent[];
  venue: {
    name: string;
    address: string;
    city: string;
    mapsUrl: string;
    imageUrl?: string;
  };
  gallery: GalleryImage[];
  contacts: InvitationContact[];
  rsvpDeadline: string;
  finale: { title: string; note: string; qr?: boolean };
  music: { enabled: boolean; label: string; url?: string };
  publicUrl?: string;
  qrCenterText?: string;
}

export interface PersonProfile {
  photoUrl: string;
  qualification: string;
  occupation: string;
  parents: string;
}

export const wedding: WeddingData = {
  couple: { groom: "Ahmed", bride: "Ayesha", joiner: "&" },
  invocation: {
    kind: "allah",
    text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful",
    dir: "rtl",
    font: "arabic",
  },
  headlineDate: "14 December 2026",
  weddingISO: "2026-12-14T11:00:00+05:30",
  message: {
    kicker: "Together with their families",
    body: "invite you to celebrate their special day",
    closing:
      "Two families, one thread of gold — woven through henna, prayer and a promise kept for a lifetime.",
  },
  events: [
    {
      id: "mehendi",
      name: "Mehendi",
      date: "12 December 2026",
      time: "5:00 PM",
      venue: "Falaknuma Courtyard",
      city: "Hyderabad",
      mapsUrl: "https://maps.google.com/?q=Falaknuma+Palace+Hyderabad",
      note: "Henna, qawwali and marigold light",
    },
    {
      id: "haldi",
      name: "Haldi",
      date: "13 December 2026",
      time: "10:00 AM",
      venue: "Zehra Manzil Lawns",
      city: "Hyderabad",
      mapsUrl: "https://maps.google.com/?q=Hyderabad",
      note: "Turmeric, laughter and marigold",
    },
    {
      id: "nikah",
      name: "Nikah",
      date: "14 December 2026",
      time: "11:00 AM",
      venue: "Masjid-e-Noor & Gulshan Hall",
      city: "Hyderabad",
      mapsUrl: "https://maps.google.com/?q=Hyderabad",
      note: "The ceremony of vows",
    },
    {
      id: "walima",
      name: "Walima",
      date: "16 December 2026",
      time: "7:30 PM",
      venue: "Taj Deccan Banquet",
      city: "Hyderabad",
      mapsUrl: "https://maps.google.com/?q=Taj+Deccan+Hyderabad",
      note: "Dinner reception",
    },
  ],
  venue: {
    name: "Gulshan Hall, Taj Deccan",
    address: "Road No. 1, Banjara Hills",
    city: "Hyderabad, Telangana 500034",
    mapsUrl: "https://maps.google.com/?q=Taj+Deccan+Banjara+Hills+Hyderabad",
  },
  gallery: [
    { src: couple1, alt: "Ahmed and Ayesha at golden hour", width: 800, height: 1104, span: "tall" },
    { src: couple2, alt: "Bridal hands with mehendi", width: 928, height: 720, span: "wide" },
    { src: couple3, alt: "The couple laughing under marigolds", width: 800, height: 1104, span: "tall" },
    { src: couple4, alt: "Diya and roses on the wedding table", width: 928, height: 720, span: "wide" },
  ],
  contacts: [],
  rsvpDeadline: "30 November 2026",
  finale: {
    title: "Thank you for celebrating with us",
    note: "Your presence is the finest ornament of all",
    qr: true,
  },
  music: { enabled: true, label: "Ambient raag" },
};
