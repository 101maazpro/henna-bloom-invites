import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Invitation } from "./index";
import {
  fetchPublicInvitation,
  getSlugFromPathname,
  mapInvitation,
  mapShopFallback,
  safePublicUrl,
  type PublicInvitationResponse,
} from "@/lib/invitation-content";

import { BrandRibbon } from "@/components/invitation/BrandRibbon";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Invitation } from "./index";
import {
  fetchPublicInvitation,
  getSlugFromPathname,
  mapInvitation,
  mapShopFallback,
  safePublicUrl,
  type PublicInvitationResponse,
} from "@/lib/invitation-content";

import { BrandRibbon } from "@/components/invitation/BrandRibbon";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "ZAR Wedding Invitations" },
      {
        name: "description",
        content: "A hand-drawn mehendi wedding invitation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "ZAR Wedding Invitations" },
      {
        property: "og:description",
        content: "Open a private wedding invitation.",
      },
      {
        property: "og:image",
        content: "https://henna-bloom-invites.vercel.app/og-image.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://henna-bloom-invites.vercel.app/og-image.png",
      },
    ],
  }),
  component: SlugRoute,
});

function SlugRoute() {
  const slug = Route.useParams({ select: (params) => params.slug });
  return <SlugInvitation key={slug} routeSlug={slug} />;
}

function SlugInvitation({ routeSlug }: { routeSlug: string }) {
  const [result, setResult] = useState<PublicInvitationResponse | null>(null);
  const [requestError, setRequestError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const slug = getSlugFromPathname(window.location.pathname);
    setResult(null);
    setRequestError(false);
    if (!slug) {
      setResult({ state: "not_found" });
      return;
    }
    let active = true;
    void fetchPublicInvitation(slug)
      .then((data) => active && setResult(data))
      .catch(() => active && setRequestError(true));
    return () => {
      active = false;
    };
  }, [routeSlug, attempt]);

  if (requestError)
    return (
      <StatusPage
        title="Unable to load invitation"
        message="Please try again in a moment."
        retry={() => setAttempt((value) => value + 1)}
      />
    );
  if (!result)
    return <StatusPage title="Loading invitation" message="Preparing your invitation…" />;
  if (result.state === "live")
    return <Invitation key={`${routeSlug}-${attempt}`} data={mapInvitation(result)} />;

  if (result.state === "fallback") {
    const shop = mapShopFallback(result.shop);
    const whatsappUrl =
      safePublicUrl(shop.whatsapp) ||
      (shop.whatsapp.replace(/\D/g, "") ? `https://wa.me/${shop.whatsapp.replace(/\D/g, "")}` : "");
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-sm">
          {shop.name && <p className="eyebrow">{shop.name}</p>}
          <h1 className="display-name mt-4 text-4xl">Invitation unavailable</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This invitation is no longer available.
          </p>
          {(shop.address || shop.city) && (
            <p className="mt-5 font-display text-base text-foreground/80">
              {[shop.address, shop.city].filter(Boolean).join(", ")}
            </p>
          )}
          {shop.phone && (
            <a href={`tel:${shop.phone}`} className="mt-5 block text-xs text-muted-foreground">
              {shop.phone}
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-block border border-accent px-5 py-3 text-xs uppercase tracking-widest"
            >
              Contact on WhatsApp
            </a>
          )}
          {shop.businessContact && (
            <p className="mt-5 text-xs text-muted-foreground">{shop.businessContact}</p>
          )}
        </div>
        <BrandRibbon name={shop.name} />
      </main>
    );
  }

  return (
    <StatusPage title="Invitation not found" message="This invitation link is invalid." home />
  );
}

function StatusPage({
  title,
  message,
  home = false,
  retry,
}: {
  title: string;
  message: string;
  home?: boolean;
  retry?: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="display-name text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        {retry && (
          <button
            type="button"
            onClick={retry}
            className="mt-6 border border-accent px-5 py-3 text-xs uppercase tracking-widest"
          >
            Try again
          </button>
        )}
        {home && (
          <Link
            to="/"
            className="mt-6 inline-block border border-accent px-5 py-3 text-xs uppercase tracking-widest"
          >
            Go home
          </Link>
        )}
      </div>
    </main>
  );
}

export const Route = createFileRoute("/$slug")({
  component: SlugRoute,
});

function SlugRoute() {
  const slug = Route.useParams({ select: (params) => params.slug });
  return <SlugInvitation key={slug} routeSlug={slug} />;
}

function SlugInvitation({ routeSlug }: { routeSlug: string }) {
  const [result, setResult] = useState<PublicInvitationResponse | null>(null);
  const [requestError, setRequestError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const slug = getSlugFromPathname(window.location.pathname);
    setResult(null);
    setRequestError(false);
    if (!slug) {
      setResult({ state: "not_found" });
      return;
    }
    let active = true;
    void fetchPublicInvitation(slug)
      .then((data) => active && setResult(data))
      .catch(() => active && setRequestError(true));
    return () => {
      active = false;
    };
  }, [routeSlug, attempt]);

  if (requestError)
    return (
      <StatusPage
        title="Unable to load invitation"
        message="Please try again in a moment."
        retry={() => setAttempt((value) => value + 1)}
      />
    );
  if (!result)
    return <StatusPage title="Loading invitation" message="Preparing your invitation…" />;
  if (result.state === "live")
    return <Invitation key={`${routeSlug}-${attempt}`} data={mapInvitation(result)} />;

  if (result.state === "fallback") {
    const shop = mapShopFallback(result.shop);
    const whatsappUrl =
      safePublicUrl(shop.whatsapp) ||
      (shop.whatsapp.replace(/\D/g, "") ? `https://wa.me/${shop.whatsapp.replace(/\D/g, "")}` : "");
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-sm">
          {shop.name && <p className="eyebrow">{shop.name}</p>}
          <h1 className="display-name mt-4 text-4xl">Invitation unavailable</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This invitation is no longer available.
          </p>
          {(shop.address || shop.city) && (
            <p className="mt-5 font-display text-base text-foreground/80">
              {[shop.address, shop.city].filter(Boolean).join(", ")}
            </p>
          )}
          {shop.phone && (
            <a href={`tel:${shop.phone}`} className="mt-5 block text-xs text-muted-foreground">
              {shop.phone}
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-block border border-accent px-5 py-3 text-xs uppercase tracking-widest"
            >
              Contact on WhatsApp
            </a>
          )}
          {shop.businessContact && (
            <p className="mt-5 text-xs text-muted-foreground">{shop.businessContact}</p>
          )}
        </div>
        <BrandRibbon name={shop.name} />
      </main>
    );
  }

  return (
    <StatusPage title="Invitation not found" message="This invitation link is invalid." home />
  );
}

function StatusPage({
  title,
  message,
  home = false,
  retry,
}: {
  title: string;
  message: string;
  home?: boolean;
  retry?: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="display-name text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        {retry && (
          <button
            type="button"
            onClick={retry}
            className="mt-6 border border-accent px-5 py-3 text-xs uppercase tracking-widest"
          >
            Try again
          </button>
        )}
        {home && (
          <Link
            to="/"
            className="mt-6 inline-block border border-accent px-5 py-3 text-xs uppercase tracking-widest"
          >
            Go home
          </Link>
        )}
      </div>
    </main>
  );
}
