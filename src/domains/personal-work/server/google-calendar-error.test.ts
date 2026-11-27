import assert from "node:assert/strict";
import test from "node:test";
import { calendarLoadFailure, calendarRefreshFailure, GoogleCalendarConnectionError } from "./google-calendar-error";
import { encryptCalendarToken } from "./google-calendar-crypto";

test("expired grants require reconnect; configuration, quota and network failures do not", async () => {
  for (const [code, expected] of [["invalid_grant", "RECONNECT_REQUIRED"], ["invalid_token", "RECONNECT_REQUIRED"], ["invalid_client", "CONFIGURATION"], ["unauthorized_client", "CONFIGURATION"], ["temporarily_unavailable", "TEMPORARY"]] as const) {
    const error = await calendarRefreshFailure(Response.json({ error: code, error_description: "private-provider-detail" }, { status: 400 }));
    assert.equal(error.code, expected);
    assert.equal(calendarLoadFailure(error).reconnectRequired, expected === "RECONNECT_REQUIRED");
    assert.ok(!calendarLoadFailure(error).loadError.includes("private-provider-detail"));
  }
  assert.equal((await calendarRefreshFailure(new Response("", { status: 503 }))).code, "TEMPORARY");
  const failure = calendarLoadFailure(new Error("private-token-or-internal-detail"));
  assert.equal(failure.reconnectRequired, false);
  assert.ok(!failure.loadError.includes("private-token"));
});

test("calendar reads surface revoked tokens and recover a normal expired access token", async t => {
  const holder = globalThis as typeof globalThis & { __prisma?: unknown };
  const previous = holder.__prisma;
  let refreshTokenCipher: string | null = encryptCalendarToken("fixture-refresh");
  let expires = new Date(0);
  let mode = "revoked";
  let writes = 0;
  const requests: string[] = [];
  const connection = () => ({ id: "connection", calendarId: "primary", accessTokenCipher: encryptCalendarToken("fixture-access"), refreshTokenCipher, tokenExpiresAt: expires });
  holder.__prisma = {
    personalTaskCalendarLink:{findMany:async()=>[]},
    googleCalendarConnection: {
      findUnique: async () => connection(),
      update: async () => { writes++; return connection(); },
    },
  };
  t.after(() => { holder.__prisma = previous; });
  t.mock.method(globalThis, "fetch", async (url: string | URL) => {
    requests.push(String(url));
    if (String(url).includes("oauth2.googleapis.com/token")) return mode === "success"
      ? Response.json({ access_token: "fixture-new-access", expires_in: 3600 })
      : Response.json({ error: "invalid_grant" }, { status: 400 });
    return Response.json({ items: [] });
  });
  const { listPersonalGoogleCalendarEvents } = await import("./google-calendar.service");
  await assert.rejects(listPersonalGoogleCalendarEvents("alice"), error => error instanceof GoogleCalendarConnectionError && error.code === "RECONNECT_REQUIRED");
  assert.equal(writes, 0);
  assert.equal(requests.length, 1);
  mode = "success";
  assert.deepEqual(await listPersonalGoogleCalendarEvents("alice"), []);
  assert.ok(requests.some(url => url.includes("/calendar/v3/")));
  refreshTokenCipher = null;
  await assert.rejects(listPersonalGoogleCalendarEvents("alice"), error => error instanceof GoogleCalendarConnectionError && error.code === "RECONNECT_REQUIRED");
  refreshTokenCipher = encryptCalendarToken("fixture-refresh");
  expires = new Date(Date.now() + 3600000);
});
