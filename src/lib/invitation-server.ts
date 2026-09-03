import { createServerFn } from "@tanstack/react-start";
import type { WeddingData } from "@/data/wedding";

type InvitationRow = Record<string, unknown>;

const LOCAL_PUBLIC_ORIGIN = "https://henna-bloom-invites.vercel.app/";

const text = (row: InvitationRow, key: string, fallback = "") =>
  typeof row[key] === "string" ? (row[key] as string) : fallback;

const json = <T>(row: InvitationRow, key: string, fallback: T): T =>
  row[key] == null ? fallback : (row[key] as T);

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function isExpired(row: InvitationRow, now = Date.now()) {
  const from = new Date(text(row, "active_from_01")).getTime();
  const until = new Date(text(row, "active_until_01")).getTime();
  return Number.isFinite(from) && now < from || Number.isFinite(until) && now > until;
}

function mapRow(row: InvitationRow, slug: string): WeddingData {
  const events = json<WeddingData["events"]>(row, "events_01", []);
  const nikah = events.find((event) => event.id === "nikah" || event.name.toLowerCase() === "nikah");
  const parsedEventDate = nikah ? new Date(`${nikah.date} ${nikah.time} GMT+0530`) : null;
  const eventDate = parsedEventDate && !Number.isNaN(parsedEventDate.getTime()) ? parsedEventDate.toISOString() : "";
  const weddingDate = text(row, "wedding_date_01") || eventDate || text(row, "active_from_01");
  const city = text(row, "venue_city_01");
  const joiner = text(row, "couple_joiner_01", "&");
  const publicBase = LOCAL_PUBLIC_ORIGIN;

  return {
    couple: { groom: text(row, "groom_name_01"), bride: text(row, "bride_name_01"), joiner },
    invocation: {
      kind: text(row, "opening_kind_01", "none") as WeddingData["invocation"]["kind"],
      text: text(row, "opening_text_01"),
      translation: text(row, "opening_translation_01") || undefined,
      dir: text(row, "opening_direction_01", "ltr") as "ltr" | "rtl",
      font: text(row, "opening_kind_01") === "allah" ? "arabic" : text(row, "opening_kind_01") === "om" || text(row, "opening_kind_01") === "ram" ? "devanagari" : "serif",
    },
    headlineDate: text(row, "headline_date_01", formatDate(weddingDate)),
    weddingISO: weddingDate,
    message: {
      kicker: text(row, "message_kicker_01", "Together with their families"),
      body: text(row, "message_body_01", "invite you to celebrate their special day"),
      closing: text(row, "message_closing_01"),
    },
    events,
    venue: { name: text(row, "venue_name_01"), address: text(row, "venue_address_01"), city, mapsUrl: text(row, "venue_maps_url_01") },
    gallery: [
      ...json<WeddingData["gallery"]>(row, "memories_gallery_01", []),
      ...json<WeddingData["gallery"]>(row, "couple_photos_01", []),
    ],
    social: json<WeddingData["social"]>(row, "social_links_01", []),
    rsvpDeadline: text(row, "rsvp_deadline_01", formatDate(text(row, "active_until_01"))),
    finale: { title: text(row, "finale_title_01", "Thank you for celebrating with us"), note: text(row, "finale_note_01", "Your presence is the finest ornament of all"), qr: row.finale_qr_enabled_01 !== false },
    music: { enabled: row.music_enabled_01 !== false, label: text(row, "music_label_01", "Ambient raag") },
    publicUrl: `${publicBase.replace(/\/$/, "")}/${slug}`,
    qrCenterText: text(row, "qr_center_text_01", "Groom & Bride Invites"),
  };
}

export const getInvitationBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug.trim())
  .handler(async ({ data: slug }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");

    const query = new URL(`${url.replace(/\/$/, "")}/rest/v1/design_01_invitations`);
    query.searchParams.set("slug_01", `eq.${slug}`);
    query.searchParams.set("select", "*");
    query.searchParams.set("limit", "1");
    const response = await fetch(query, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!response.ok) throw new Error(`Invitation lookup failed (${response.status})`);
    const rows = (await response.json()) as InvitationRow[];
    const row = rows[0];
    if (!row) return { kind: "not-found" as const };
    if (text(row, "status_01") !== "published" || isExpired(row)) {
      return {
        kind: "expired" as const,
        shop: {
          name: text(row, "shop_name_01", "Henna Bloom Invites"),
          location: text(row, "shop_location_01", "Wedding invitations crafted with care"),
          contact: text(row, "shop_contact_01"),
          locationUrl: text(row, "shop_location_url_01"),
          date: new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date()),
        },
      };
    }
    return { kind: "active" as const, data: mapRow(row, slug) };
  });
