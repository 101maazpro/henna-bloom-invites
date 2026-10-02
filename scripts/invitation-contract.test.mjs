import { Buffer } from "node:buffer";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/lib/invitation-content.ts", import.meta.url),
  "utf8",
).replaceAll("import.meta.env", "globalThis.__invitationTestEnv");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const {
  getSlugFromPathname,
  mapInvitation,
  mapShopFallback,
  safePublicUrl,
  weddingTarget,
  fetchPublicInvitation,
} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("slug decoding rejects malformed, empty and encoded separator paths", () => {
  assert.equal(getSlugFromPathname("/"), null);
  assert.equal(getSlugFromPathname("/couple/"), "couple");
  assert.equal(getSlugFromPathname("/old/final"), "final");
  assert.equal(getSlugFromPathname("/%E0%A4%A"), null);
  assert.equal(getSlugFromPathname("/a%2Fb"), null);
  assert.equal(getSlugFromPathname("/a%5Cb"), null);
  assert.equal(getSlugFromPathname("/%20"), null);
});

test("optional and malformed fields never introduce sample invitation data", () => {
  for (const content of [
    undefined,
    null,
    [],
    "invalid",
    { events: {}, gallery: {}, contacts: {} },
  ]) {
    const mapped = mapInvitation({ state: "live", content });
    assert.equal(mapped.couple.groom, "");
    assert.equal(mapped.couple.bride, "");
    assert.equal(mapped.couple.joiner, "");
    assert.deepEqual(mapped.events, []);
    assert.deepEqual(mapped.gallery, []);
    assert.deepEqual(mapped.contacts, []);
    assert.equal(mapped.weddingISO, "");
    assert.equal(mapped.brandName, "");
  }
  assert.equal(mapShopFallback({}).name, "");
});

test("live contacts use only the first two entries and require their own phone", () => {
  const data = mapInvitation({
    state: "live",
    content: {
      contacts: [
        { name: "No phone" },
        { name: "Family", phone: "+91 90000 00000", whatsapp_url: "javascript:alert(1)" },
        { phone: "123" },
      ],
    },
    shop: { phone: "999" },
  });
  assert.deepEqual(data.contacts, [{ name: "Family", phone: "+91 90000 00000", whatsappUrl: "" }]);
});

test("media and external links reject unsafe URLs and malformed entries", () => {
  const data = mapInvitation({
    state: "live",
    content: {
      bride_name: "Bride",
      bride_photo_url: "https://example.test/bride.jpg",
      gallery: [
        null,
        42,
        "javascript:alert(1)",
        { src: "https://example.test/photo.jpg", width: -1 },
      ],
      events: [null, 7, {}, { title: "Reception", maps_url: "javascript:alert(1)" }],
      maps_url: "data:text/html,unsafe",
    },
  });
  assert.equal(data.couple.joiner, "");
  assert.equal(data.gallery.length, 2);
  assert.equal(data.gallery[0].alt, "Bride");
  assert.equal(data.gallery[1].width, 800);
  assert.equal(data.events.length, 1);
  assert.equal(data.events[0].mapsUrl, "");
  assert.equal(data.venue.mapsUrl, "");
  assert.equal(safePublicUrl("javascript:alert(1)"), "");
});

test("countdown uses the supplied date and time, and never a time-only target", () => {
  assert.equal(weddingTarget("2027-12-14", "11:00:00"), "2027-12-14T11:00:00");
  assert.equal(weddingTarget("", "11:00"), "");
  assert.equal(weddingTarget("2027-12-14", ""), "");
  assert.equal(weddingTarget("2027-12-14T11:00:00+05:30", ""), "2027-12-14T11:00:00+05:30");
});

test("RPC is the only request, normalizes one envelope and fails safely", async () => {
  globalThis.__invitationTestEnv = {
    VITE_SUPABASE_URL: "https://example.test/",
    VITE_SUPABASE_ANON_KEY: "test-only-public-key",
  };
  const originalFetch = globalThis.fetch;
  const calls = [];
  let payload = { data: { state: "live", content: { groom_name: "From RPC" } } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => payload };
  };
  try {
    assert.equal((await fetchPublicInvitation("couple")).state, "live");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://example.test/rest/v1/rpc/get_public_invitation_content");
    assert.equal(calls[0].options.method, "POST");
    assert.deepEqual(JSON.parse(calls[0].options.body), { p_slug: "couple" });
    payload = { state: "fallback", shop: { name: "Public shop" } };
    assert.equal((await fetchPublicInvitation("couple")).state, "fallback");
    payload = { data: {}, state: "live" };
    await assert.rejects(fetchPublicInvitation("couple"));
    payload = { state: "unknown" };
    await assert.rejects(fetchPublicInvitation("couple"));
    globalThis.fetch = async () => {
      throw new Error("offline");
    };
    await assert.rejects(fetchPublicInvitation("couple"));
    globalThis.__invitationTestEnv = {};
    await assert.rejects(fetchPublicInvitation("couple"));
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.__invitationTestEnv;
  }
});

const guardSource = readFileSync(
  new URL("../src/lib/invalid-invitation-page.ts", import.meta.url),
  "utf8",
);
const guardModule = ts.transpileModule(guardSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { hasMalformedPathname, renderInvalidInvitationPage } = await import(
  `data:text/javascript;base64,${Buffer.from(guardModule).toString("base64")}`
);
test("malformed percent encoding is stopped before framework routing", () => {
  assert.equal(hasMalformedPathname("/%E0%A4%A"), true);
  assert.equal(hasMalformedPathname("/valid"), false);
  assert.equal(hasMalformedPathname("/"), false);
  assert.ok(renderInvalidInvitationPage().includes("Invitation not found"));
  assert.ok(renderInvalidInvitationPage().includes('href="/favicon.ico"'));
});
