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
  weddingTime: string;
  brandName: string;
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
