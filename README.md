# Henna Bloom Invites

A mobile-first public wedding invitation with ivory paper, henna line drawings, serif typography, ornamental photographs and a final mandala. The integration contract is [PUBLIC_INVITATION_INTEGRATION.md](PUBLIC_INVITATION_INTEGRATION.md).

## Development

```sh
npm install
npm run dev
npm run build
npx tsc --noEmit
node --test scripts/invitation-contract.test.mjs
```

Copy `.env.example` to a local, Git-ignored `.env`. Configure only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the central ZAR V2 project's public settings. Enter actual values manually in the hosting provider. The example file intentionally contains only empty placeholders.

Open an invitation at `/:slug`. The root page asks visitors to use their invitation link and contains no sample wedding. The browser makes one POST to `get_public_invitation_content` per visit or explicit retry, with the sanitized pathname slug. It never queries tables or implements invitation lifecycle rules.

## Public content

Live invitations map the RPC's content into optional couple profiles, invocation, wedding date and time, events, venue, gallery, music and up to two phone contacts. Missing optional content hides its section. Music plays only from the supplied URL after interaction. Countdown requires a valid future date and time; date-only invitations do not guess a ceremony time. Date/time values without a timezone follow the viewer's browser timezone.

Names appear on separate centered lines with an isolated ampersand only when both names exist. The headline date appears once in the hero. Maps and WhatsApp links open safely in a new tab; call links use the contact's own phone.

The translucent viewport-bottom brand ribbon uses only `shop.name` returned by the public RPC, including during live rendering under the contract's floating-brand requirement. It hides when that field is absent; it never substitutes a brand or exposes live shop contacts. The central contract currently specifies no separate live brand field.

Fallback renders only populated allowed shop fields. Not-found and retryable request-error screens never substitute invitation data. No QR is shown on the public invitation. No RSVP submission endpoint exists in the contract, so the public page uses its contact buttons rather than pretending to save attendance.

## Hosting and icons

This is a TanStack Start application. The existing Lovable Vite configuration builds its client and host runtime; deploy using a compatible TanStack Start/Nitro hosting setup. `vercel.json` retains the specified SPA rewrite for invitation-path refreshes. Do not deploy only the generated assets without an application entry/runtime.

The document head uses the existing `public/favicon.ico`, PNG favicons, Apple touch icons, Android manifest and Microsoft browser configuration. Icon image files are preserved exactly. Manifest display metadata describes this invitation rather than an admin dashboard.

## Lovable

[Continue in Lovable](https://lovable.dev/projects/7c533a05-2275-4f02-95f6-77c0b646387d). Keep connected-branch commits in a working state and preserve published Git history.
