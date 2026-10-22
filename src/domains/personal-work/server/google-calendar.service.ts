import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/server/db/client";
import { decryptCalendarToken, encryptCalendarToken } from "./google-calendar-crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_CALENDAR_EVENT_SCOPE = "https://www.googleapis.com/auth/calendar.events";

type GoogleCalendarEvent = {
  id?: string;
  summary?: string;
  description?: string;
  htmlLink?: string;
  location?: string;
  status?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

async function googleApiError(response: Response, operation: string) {
  let message = `${operation} failed (${response.status})`;
  try {
    const body = await response.json() as {
      error?: { message?: string; errors?: Array<{ reason?: string }> };
    };
    const reason = body.error?.errors?.find((item) => item.reason)?.reason;
    const detail = body.error?.message?.trim();
    if (detail) message = `${operation} failed (${response.status}): ${detail}`;
    if (reason && !message.includes(reason)) message += ` [${reason}]`;
  } catch {
    // Google may return an empty/non-JSON response. Keep the status-only error.
  }
  return new Error(message);
}

function config() {
  return {
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim() || "",
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim() || "",
    appUrl: (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, ""),
    stateSecret: process.env.AUTH_SECRET || "watch-shop-local-calendar-state",
  };
}

export function isGoogleCalendarConfigured() {
  const value = config();
  return Boolean(value.clientId && value.clientSecret);
}

export function createGoogleCalendarState(userId: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60;
  const payload = `${userId}.${expiresAt}`;
  const signature = createHmac("sha256", config().stateSecret).update(payload).digest("base64url");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyGoogleCalendarState(state: string) {
  const decoded = Buffer.from(state, "base64url").toString("utf8");
  const [userId, expiresText, signature] = decoded.split(".");
  const expiresAt = Number(expiresText);
  if (!userId || !signature || !Number.isSafeInteger(expiresAt) || expiresAt < Date.now() / 1000) return null;
  const expected = createHmac("sha256", config().stateSecret).update(`${userId}.${expiresText}`).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return userId;
}

export function googleCalendarAuthorizationUrl(userId: string) {
  const value = config();
  if (!value.clientId) throw new Error("Google Calendar OAuth chưa được cấu hình");
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", value.clientId);
  url.searchParams.set("redirect_uri", `${value.appUrl}/api/admin/personal-work/google/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("scope", `openid email ${GOOGLE_CALENDAR_EVENT_SCOPE}`);
  url.searchParams.set("state", createGoogleCalendarState(userId));
  return url.toString();
}

export async function exchangeGoogleCalendarCode(userId: string, code: string) {
  const value = config();
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: value.clientId,
      client_secret: value.clientSecret,
      redirect_uri: `${value.appUrl}/api/admin/personal-work/google/callback`,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google OAuth token exchange failed (${response.status})`);
  const token = await response.json() as { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; id_token?: string };
  const grantedScopes = new Set((token.scope || "").split(/\s+/).filter(Boolean));
  if (!grantedScopes.has(GOOGLE_CALENDAR_EVENT_SCOPE)) {
    throw new Error("Google Calendar chưa cấp quyền quản lý sự kiện; vui lòng kiểm tra Data Access và kết nối lại");
  }
  let email: string | null = null;
  if (token.id_token) {
    try { email = JSON.parse(Buffer.from(token.id_token.split(".")[1], "base64url").toString("utf8")).email ?? null; } catch { email = null; }
  }
  await prisma.googleCalendarConnection.upsert({
    where: { userId },
    update: {
      googleAccountEmail: email,
      accessTokenCipher: encryptCalendarToken(token.access_token),
      ...(token.refresh_token ? { refreshTokenCipher: encryptCalendarToken(token.refresh_token) } : {}),
      tokenExpiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null,
      scope: token.scope || null,
      connectedAt: new Date(),
    },
    create: {
      userId,
      googleAccountEmail: email,
      accessTokenCipher: encryptCalendarToken(token.access_token),
      refreshTokenCipher: token.refresh_token ? encryptCalendarToken(token.refresh_token) : null,
      tokenExpiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null,
      scope: token.scope || null,
    },
  });
}

async function accessToken(userId: string, forceRefresh = false) {
  const connection = await prisma.googleCalendarConnection.findUnique({ where: { userId } });
  if (!connection) throw new Error("Google Calendar chưa được kết nối");
  if (!forceRefresh && (!connection.tokenExpiresAt || connection.tokenExpiresAt.getTime() > Date.now() + 60_000)) {
    return { connection, token: decryptCalendarToken(connection.accessTokenCipher) };
  }
  if (!connection.refreshTokenCipher) throw new Error("Kết nối Google Calendar đã hết hạn; vui lòng kết nối lại");
  const value = config();
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: value.clientId,
      client_secret: value.clientSecret,
      refresh_token: decryptCalendarToken(connection.refreshTokenCipher),
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google token refresh failed (${response.status})`);
  const refreshed = await response.json() as { access_token: string; expires_in?: number };
  const next = await prisma.googleCalendarConnection.update({
    where: { id: connection.id },
    data: {
      accessTokenCipher: encryptCalendarToken(refreshed.access_token),
      tokenExpiresAt: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000) : null,
    },
  });
  return { connection: next, token: refreshed.access_token };
}

async function fetchGoogleWithTokenRetry(
  userId: string,
  input: string | URL,
  init: RequestInit = {},
) {
  let auth = await accessToken(userId);
  const request = (token: string) => fetch(input, {
    ...init,
    headers: { ...init.headers, authorization: `Bearer ${token}` },
  });
  let response = await request(auth.token);
  if (response.status === 401 && auth.connection.refreshTokenCipher) {
    auth = await accessToken(userId, true);
    response = await request(auth.token);
  }
  return { auth, response };
}

export async function syncPersonalTaskToGoogle(userId: string, taskItemId: string) {
  const item = await prisma.taskItem.findFirst({
    where: {
      id: taskItemId,
      task: { kind: "PERSONAL" },
      OR: [
        { task: { createdByUserId: userId } },
        { task: { assignedToUserId: userId } },
        { personalShares: { some: { userId } } },
      ],
    },
    include: { task: { select: { id: true, title: true } } },
  });
  if (!item) throw new Error("Không tìm thấy công việc cá nhân");
  const auth = await accessToken(userId);
  const existing = await prisma.personalTaskCalendarLink.findUnique({ where: { userId_taskItemId: { userId, taskItemId } } });
  const start = item.dueAt || new Date();
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const payload = {
    summary: item.title,
    description: item.note || "Đồng bộ từ Watch Shop Admin",
    start: { dateTime: start.toISOString(), timeZone: "Asia/Bangkok" },
    end: { dateTime: end.toISOString(), timeZone: "Asia/Bangkok" },
    status: item.status === "CANCELLED" ? "cancelled" : "confirmed",
    extendedProperties: { private: { watchShopTaskItemId: item.id, source: "WATCH_SHOP_PERSONAL_WORK" } },
  };
  const syncHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  if (existing?.syncHash === syncHash) return existing;
  const endpoint = existing
    ? `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(auth.connection.calendarId)}/events/${encodeURIComponent(existing.eventId)}`
    : `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(auth.connection.calendarId)}/events`;
  const { response } = await fetchGoogleWithTokenRetry(userId, endpoint, {
    method: existing ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) throw await googleApiError(response, "Google Calendar sync");
  const event = await response.json() as { id: string; htmlLink?: string };
  const link = await prisma.personalTaskCalendarLink.upsert({
    where: { userId_taskItemId: { userId, taskItemId } },
    update: { eventId: event.id, eventHtmlLink: event.htmlLink || null, lastSyncedAt: new Date(), syncHash },
    create: { userId, taskItemId, connectionId: auth.connection.id, calendarId: auth.connection.calendarId, eventId: event.id, eventHtmlLink: event.htmlLink || null, syncHash },
  });
  await prisma.googleCalendarConnection.update({ where: { id: auth.connection.id }, data: { lastSyncedAt: new Date() } });
  return link;
}

export async function syncPersonalTaskToGoogleIfLinked(userId: string, taskItemId: string) {
  const link = await prisma.personalTaskCalendarLink.findUnique({
    where: { userId_taskItemId: { userId, taskItemId } },
    select: { id: true },
  });
  if (link) await syncPersonalTaskToGoogle(userId, taskItemId);
}

export async function deletePersonalTaskFromGoogle(userId: string, taskItemId: string) {
  const link = await prisma.personalTaskCalendarLink.findUnique({
    where: { userId_taskItemId: { userId, taskItemId } },
  });
  if (!link) return;
  const auth = await accessToken(userId);
  const endpoint = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(link.calendarId)}/events/${encodeURIComponent(link.eventId)}`;
  const { response } = await fetchGoogleWithTokenRetry(userId, endpoint, { method: "DELETE", cache: "no-store" });
  if (!response.ok && response.status !== 404 && response.status !== 410) {
    throw await googleApiError(response, "Google Calendar delete");
  }
  await prisma.personalTaskCalendarLink.delete({ where: { id: link.id } });
  await prisma.googleCalendarConnection.update({ where: { id: auth.connection.id }, data: { lastSyncedAt: new Date() } });
}

export async function listPersonalGoogleCalendarEvents(userId: string) {
  let auth = await accessToken(userId);
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setFullYear(to.getFullYear() + 1);
  to.setHours(23, 59, 59, 999);

  const events: GoogleCalendarEvent[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(`${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(auth.connection.calendarId)}/events`);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("showDeleted", "false");
    url.searchParams.set("maxResults", "250");
    url.searchParams.set("timeMin", from.toISOString());
    url.searchParams.set("timeMax", to.toISOString());
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const result = await fetchGoogleWithTokenRetry(userId, url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    const response = result.response;
    auth = result.auth;
    if (!response.ok) throw await googleApiError(response, "Google Calendar load");
    const body = await response.json() as { items?: GoogleCalendarEvent[]; nextPageToken?: string };
    events.push(...(body.items || []));
    pageToken = body.nextPageToken;
  } while (pageToken && events.length < 2_000);

  const visibleEvents = events.filter((event) => event.id && event.status !== "cancelled" && (event.start?.dateTime || event.start?.date));
  const eventIds = visibleEvents.map((event) => event.id!);
  const links = eventIds.length
    ? await prisma.personalTaskCalendarLink.findMany({
        where: { userId, calendarId: auth.connection.calendarId, eventId: { in: eventIds } },
        select: { eventId: true, taskItemId: true },
      })
    : [];
  const linkMap = new Map(links.map((link) => [link.eventId, link.taskItemId]));
  await prisma.googleCalendarConnection.update({ where: { id: auth.connection.id }, data: { lastSyncedAt: new Date() } });
  return visibleEvents.map((event) => ({
    id: event.id!,
    title: event.summary?.trim() || "(Không có tiêu đề)",
    description: event.description?.trim() || null,
    startAt: event.start?.dateTime || event.start?.date || "",
    endAt: event.end?.dateTime || event.end?.date || null,
    allDay: Boolean(event.start?.date && !event.start?.dateTime),
    htmlLink: event.htmlLink || null,
    location: event.location?.trim() || null,
    linkedTaskItemId: linkMap.get(event.id!) || null,
  }));
}
