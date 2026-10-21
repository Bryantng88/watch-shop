import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/server/db/client";
import { decryptCalendarToken, encryptCalendarToken } from "./google-calendar-crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_CALENDAR_EVENT_SCOPE = "https://www.googleapis.com/auth/calendar.events";

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

async function accessToken(userId: string) {
  const connection = await prisma.googleCalendarConnection.findUnique({ where: { userId } });
  if (!connection) throw new Error("Google Calendar chưa được kết nối");
  if (!connection.tokenExpiresAt || connection.tokenExpiresAt.getTime() > Date.now() + 60_000) {
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

export async function syncPersonalTaskToGoogle(userId: string, taskItemId: string) {
  const item = await prisma.taskItem.findFirst({
    where: { id: taskItemId, task: { kind: "PERSONAL", OR: [{ createdByUserId: userId }, { assignedToUserId: userId }] } },
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
  };
  const syncHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  if (existing?.syncHash === syncHash) return existing;
  const endpoint = existing
    ? `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(auth.connection.calendarId)}/events/${encodeURIComponent(existing.eventId)}`
    : `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(auth.connection.calendarId)}/events`;
  const response = await fetch(endpoint, {
    method: existing ? "PUT" : "POST",
    headers: { authorization: `Bearer ${auth.token}`, "content-type": "application/json" },
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
