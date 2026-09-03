import { createFileRoute, Link } from "@tanstack/react-router";
import { Invitation } from "./index";
import { getInvitationBySlug } from "@/lib/invitation-server";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => getInvitationBySlug({ data: params.slug }),
  component: SlugInvitation,
});

function SlugInvitation() {
  const result = Route.useLoaderData();
  if (result.kind === "active") return <Invitation data={result.data} />;

  if (result.kind === "expired") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-sm">
          <p className="eyebrow">{result.shop.name}</p>
          <h1 className="display-name mt-4 text-4xl">Invitation unavailable</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This invitation has ended. Current date: {result.shop.date}.
          </p>
          <p className="mt-5 font-display text-base text-foreground/80">{result.shop.location}</p>
          {result.shop.locationUrl && (
            <a href={result.shop.locationUrl} target="_blank" rel="noreferrer noopener" className="mt-6 inline-block border border-accent px-5 py-3 text-xs uppercase tracking-widest">
              Visit location
            </a>
          )}
          {result.shop.contact && <p className="mt-5 text-xs text-muted-foreground">{result.shop.contact}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="display-name text-4xl">Invitation not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">This invitation link is invalid.</p>
        <Link to="/" className="mt-6 inline-block border border-accent px-5 py-3 text-xs uppercase tracking-widest">Go home</Link>
      </div>
    </main>
  );
}
