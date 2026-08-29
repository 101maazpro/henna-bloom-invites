import type { SocialLink } from "@/data/wedding";

const paths: Record<SocialLink["kind"], string> = {
  whatsapp:
    "M12 3a9 9 0 0 0-7.7 13.7L3.2 21l4.4-1.1A9 9 0 1 0 12 3Zm4.3 12.1c-.2.6-1.1 1.1-1.6 1.1-.4 0-.9.2-3-.8-2.5-1.1-4.1-3.7-4.2-3.9-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.2 1.5 1.9 1 .9 1.8 1.2 2 1.3.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.6 0 1.2Z",
  phone:
    "M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z",
  instagram:
    "M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Zm4.5 5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-1.2v.01",
  facebook: "M14.5 8.5H17V5.5h-2.5A3.5 3.5 0 0 0 11 9v2.5H8.5V15H11v6h3.5v-6H17l.5-3.5h-3V9c0-.3.2-.5.5-.5Z",
  youtube:
    "M3.5 8.5A3 3 0 0 1 6.5 5.5h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-7Zm7 1.5 5 2.5-5 2.5V10Z",
};

export function SocialIcons({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center justify-center gap-3">
      {links.map((l) => (
        <li key={l.kind}>
          <a
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={l.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-accent hover:bg-secondary"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={paths[l.kind]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
