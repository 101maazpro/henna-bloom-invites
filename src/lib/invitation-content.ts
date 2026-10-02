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
const string = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;
const list = (value: unknown) => (Array.isArray(value) ? value : []);

export function safePublicUrl(value: unknown): string {
  const text = string(value);
  try {
    return ["https:", "http:"].includes(new URL(text).protocol) ? text : "";
  } catch {
    return "";
  }
}

export function weddingTarget(date: string, time: string): string {
  if (!date) return "";
  const target = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? /^\d{2}:\d{2}(:\d{2})?$/.test(time)
      ? `${date}T${time}`
      : ""
    : /T\d{2}:\d{2}/.test(date)
      ? date
      : "";
  return target && Number.isFinite(Date.parse(target)) ? target : "";
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(
        date,
      );
}

function eventFrom(value: unknown, index: number, content: RecordValue): WeddingEvent | null {
  const event = asRecord(value);
  const name = string(event["name"]) || string(event["title"]) || string(event["event_name"]);
  if (!name) return null;
  return {
    id: string(event["id"], `event-${index}`),
    name,
    date: string(event["date"]) || string(event["event_date"]) || string(content["wedding_date"]),
    time: string(event["time"]) || string(event["start_time"]) || string(content["start_time"]),
    venue: string(event["venue"]) || string(event["venue_name"]) || string(content["venue_name"]),
    city: string(event["city"]) || string(content["city"]),
    mapsUrl:
      safePublicUrl(event["maps_url"]) ||
      safePublicUrl(event["mapsUrl"]) ||
      safePublicUrl(content["maps_url"]),
    note: string(event["note"]) || string(event["description"]),
  };
}

function galleryFrom(value: unknown): GalleryImage[] {
  return list(value).flatMap((item, index) => {
    if (typeof item === "string" && safePublicUrl(item)) {
      return [
        {
          src: item.trim(),
          alt: "Wedding moment",
          width: 800,
          height: 1000,
          span: index % 2 ? "wide" : "tall",
        },
      ];
    }
    const image = asRecord(item);
    const src =
      safePublicUrl(image["url"]) ||
      safePublicUrl(image["src"]) ||
      safePublicUrl(image["image_url"]);
    if (!src) return [];
    return [
      {
        src,
        alt: string(image["alt"]) || string(image["caption"]) || "Wedding moment",
        width:
          typeof image["width"] === "number" &&
          image["width"] > 0 &&
          Number.isFinite(image["width"])
            ? image["width"]
            : 800,
        height:
          typeof image["height"] === "number" &&
          image["height"] > 0 &&
          Number.isFinite(image["height"])
            ? image["height"]
            : 1000,
        span: image["span"] === "wide" ? "wide" : "tall",
      },
    ];
  });
}

function contactsFrom(value: unknown): InvitationContact[] {
  return list(value)
    .slice(0, 2)
    .flatMap((item) => {
      const contact = asRecord(item);
      const phone = string(contact["phone"]);
      if (!phone) return [];
      return [
        {
          name: string(contact["name"]),
          phone,
          whatsappUrl: safePublicUrl(contact["whatsapp_url"]),
        },
      ];
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
  const url = import.meta.env["VITE_SUPABASE_URL"];
  const key = import.meta.env["VITE_SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("Invitation service is not configured.");

  const response = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/rpc/get_public_invitation_content`,
    {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_slug: slug }),
    },
  );
  if (!response.ok) throw new Error("Unable to load this invitation.");
  const data = (await response.json()) as unknown;
  const result = asRecord(data);
  const payload = asRecord(result["data"]);
  const invitation = Object.prototype.hasOwnProperty.call(result, "data") ? payload : result;
  const state = string(invitation["state"]);
  if (state === "live" || state === "fallback" || state === "not_found")
    return invitation as PublicInvitationResponse;
  throw new Error("The invitation service returned an invalid response.");
}

export function mapShopFallback(value: unknown): ShopFallback {
  const shop = asRecord(value);
  return {
    name: string(shop["name"]),
    phone: string(shop["phone"]),
    whatsapp: string(shop["whatsapp"]),
    address: string(shop["address"]),
    city: string(shop["city"]),
    businessContact: string(shop["business_contact"]),
  };
}

export function mapInvitation(response: PublicInvitationResponse): WeddingData {
  const content = asRecord(response.content);
  const invitation = asRecord(response.invitation);
  const weddingDate = string(content["wedding_date"]);
  const events = list(content["events"])
    .map((event, index) => eventFrom(event, index, content))
    .filter((event): event is WeddingEvent => !!event);
  const photos = [
    { src: safePublicUrl(content["groom_photo_url"]), alt: "Groom" },
    { src: safePublicUrl(content["bride_photo_url"]), alt: "Bride" },
  ]
    .filter((photo) => photo.src)
    .map((photo) => ({
      ...photo,
      width: 800,
      height: 1000,
      span: "tall" as const,
    }));
  const invocation = string(content["invocation"]);

  return {
    couple: {
      groom: string(content["groom_name"]),
      bride: string(content["bride_name"]),
      joiner: string(content["groom_name"]) && string(content["bride_name"]) ? "&" : "",
    },
    profiles: {
      groom: {
        photoUrl: safePublicUrl(content["groom_photo_url"]),
        qualification: string(content["groom_qualification"]),
        occupation: string(content["groom_occupation"]),
        parents: string(content["groom_parents"]),
      },
      bride: {
        photoUrl: safePublicUrl(content["bride_photo_url"]),
        qualification: string(content["bride_qualification"]),
        occupation: string(content["bride_occupation"]),
        parents: string(content["bride_parents"]),
      },
      relatives: string(content["relatives"]),
    },
    invocation: {
      kind: invocation ? "custom" : "none",
      text: invocation,
      dir: /[\u0590-\u08ff]/.test(invocation) ? "rtl" : "ltr",
      font: /[\u0590-\u08ff]/.test(invocation)
        ? "arabic"
        : /[\u0900-\u097f]/.test(invocation)
          ? "devanagari"
          : "serif",
    },
    headlineDate: formatDate(weddingDate),
    weddingISO: weddingTarget(weddingDate, string(content["start_time"])),
    message: {
      kicker: "Together with their families",
      body: "invite you to celebrate their special day",
      closing: "",
    },
    events,
    venue: {
      name: string(content["venue_name"]),
      address: string(content["venue_address"]),
      city: string(content["city"]),
      mapsUrl: safePublicUrl(content["maps_url"]),
      imageUrl: safePublicUrl(content["venue_image_url"]),
    },
    gallery: [...photos, ...galleryFrom(content["gallery"])],
    contacts: contactsFrom(content["contacts"]),
    weddingTime: [string(content["start_time"]), string(content["end_time"])]
      .filter(Boolean)
      .join(" – "),
    brandName: string(asRecord(response.shop)["name"]),
    finale: {
      title: "Thank you for celebrating with us",
      note: "Your presence is the finest ornament of all",
      qr: false,
    },
    music: {
      enabled: content["music_enabled"] === true,
      label: "Wedding music",
      url: safePublicUrl(content["music_url"]),
    },
    publicUrl: string(invitation["public_url"]),
    qrCenterText: string(content["qr_text"]),
  };
}
