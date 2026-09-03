import type { GalleryImage, InvitationContact, WeddingData, WeddingEvent } from "@/data/wedding";

type RecordValue = Record<string, unknown>;

export type PublicInvitationResponse = {
  state: "live" | "fallback" | "not_found";
  invitation?: RecordValue;
  content?: RecordValue;
  detail?: RecordValue;
  shop?: RecordValue;
};

export type ShopFallback = {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  businessContact: string;
};

const asRecord = (value: unknown): RecordValue =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as RecordValue) : {};
const string = (value: unknown, fallback = "") => typeof value === "string" ? value.trim() : fallback;
const list = (value: unknown) => Array.isArray(value) ? value : [];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function eventFrom(value: unknown, index: number, content: RecordValue): WeddingEvent | null {
  const event = asRecord(value);
  const name = string(event.name) || string(event.title) || string(event.event_name);
  if (!name) return null;
  return {
    id: string(event.id, `event-${index}`),
    name,
    date: string(event.date) || string(event.event_date) || string(content.wedding_date),
    time: string(event.time) || string(event.start_time) || string(content.start_time),
    venue: string(event.venue) || string(event.venue_name) || string(content.venue_name),
    city: string(event.city) || string(content.city),
    mapsUrl: string(event.maps_url) || string(event.mapsUrl) || string(content.maps_url) || undefined,
    note: string(event.note) || string(event.description) || undefined,
  };
}

function galleryFrom(value: unknown): GalleryImage[] {
  return list(value).flatMap((item, index) => {
    if (typeof item === "string" && item.trim()) {
      return [{ src: item.trim(), alt: "Wedding moment", width: 800, height: 1000, span: index % 2 ? "wide" : "tall" }];
    }
    const image = asRecord(item);
    const src = string(image.url) || string(image.src) || string(image.image_url);
    if (!src) return [];
    return [{
      src,
      alt: string(image.alt) || string(image.caption) || "Wedding moment",
      width: Number(image.width) || 800,
      height: Number(image.height) || 1000,
      span: image.span === "wide" ? "wide" : "tall",
    }];
  });
}

function contactsFrom(value: unknown): InvitationContact[] {
  return list(value).slice(0, 2).flatMap((item) => {
    const contact = asRecord(item);
    const phone = string(contact.phone);
    if (!phone) return [];
    return [{ name: string(contact.name), phone, whatsappUrl: string(contact.whatsapp_url) }];
  });
}

export function getSlugFromPathname(pathname: string): string | null {
  const segment = pathname.split("/").filter(Boolean).at(-1);
  if (!segment) return null;
  try {
    const slug = decodeURIComponent(segment).trim();
    return slug && !slug.includes("/") && !slug.includes("\\") ? slug : null;
  } catch {
    return null;
  }
}

export async function fetchPublicInvitation(slug: string): Promise<PublicInvitationResponse> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Invitation service is not configured.");

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/get_public_invitation_content`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_slug: slug }),
  });
  if (!response.ok) throw new Error("Unable to load this invitation.");
  const data = await response.json() as unknown;
  const result = asRecord(data);
  const payload = asRecord(result.data);
  const invitation = Object.keys(payload).length > 0 ? payload : result;
  const state = string(invitation.state);
  if (state === "live" || state === "fallback" || state === "not_found") return invitation as PublicInvitationResponse;
  throw new Error("The invitation service returned an invalid response.");
}

export function mapShopFallback(value: unknown): ShopFallback {
  const shop = asRecord(value);
  return {
    name: string(shop.name, "Henna Bloom Invites"), phone: string(shop.phone), whatsapp: string(shop.whatsapp),
    address: string(shop.address), city: string(shop.city), businessContact: string(shop.business_contact),
  };
}

export function mapInvitation(response: PublicInvitationResponse): WeddingData {
  const content = asRecord(response.content);
  const invitation = asRecord(response.invitation);
  const weddingDate = string(content.wedding_date);
  const events = list(content.events).map((event, index) => eventFrom(event, index, content)).filter((event): event is WeddingEvent => !!event);
  const photos = [string(content.groom_photo_url), string(content.bride_photo_url)].filter(Boolean).map((src, index) => ({
    src, alt: index ? "Bride" : "Groom", width: 800, height: 1000, span: "tall" as const,
  }));
  const invocation = string(content.invocation);

  return {
    couple: { groom: string(content.groom_name), bride: string(content.bride_name), joiner: "&" },
    profiles: {
      groom: { photoUrl: string(content.groom_photo_url), qualification: string(content.groom_qualification), occupation: string(content.groom_occupation), parents: string(content.groom_parents) },
      bride: { photoUrl: string(content.bride_photo_url), qualification: string(content.bride_qualification), occupation: string(content.bride_occupation), parents: string(content.bride_parents) },
      relatives: string(content.relatives),
    },
    invocation: { kind: invocation ? "custom" : "none", text: invocation, dir: "ltr", font: "serif" },
    headlineDate: formatDate(weddingDate),
    weddingISO: weddingDate || string(content.start_time),
    message: { kicker: "Together with their families", body: "invite you to celebrate their special day", closing: "" },
    events,
    venue: { name: string(content.venue_name), address: string(content.venue_address), city: string(content.city), mapsUrl: string(content.maps_url), imageUrl: string(content.venue_image_url) },
    gallery: [...photos, ...galleryFrom(content.gallery)],
    contacts: contactsFrom(content.contacts),
    rsvpDeadline: string(content.end_time),
    finale: { title: "Thank you for celebrating with us", note: "Your presence is the finest ornament of all", qr: Boolean(string(invitation.public_url)) },
    music: { enabled: content.music_enabled === true, label: "Wedding music", url: string(content.music_url) || undefined },
    publicUrl: string(invitation.public_url) || undefined,
    qrCenterText: string(content.qr_text) || undefined,
  };
}
