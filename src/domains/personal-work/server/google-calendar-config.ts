const CALLBACK_PATH = "/api/admin/personal-work/google/callback";

export function googleCalendarReadiness(env: Readonly<Record<string, string | undefined>> = process.env) {
  if (!env.GOOGLE_CALENDAR_CLIENT_ID?.trim() || !env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim()) return { ready: false, reason: "Chưa cấu hình Google OAuth Client ID/Secret", redirectUri: null };
  if (!(env.GOOGLE_CALENDAR_TOKEN_KEY || env.AUTH_SECRET)) return { ready: false, reason: "Chưa cấu hình khóa mã hóa Google Calendar", redirectUri: null };
  if (!env.AUTH_SECRET) return { ready: false, reason: "Chưa cấu hình khóa xác thực OAuth", redirectUri: null };
  try {
    const app = new URL(env.APP_URL || "http://localhost:3000");
    const redirect = new URL(env.GOOGLE_CALENDAR_REDIRECT_URI || CALLBACK_PATH, app);
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(redirect.hostname);
    const privateAddress = /^(?:\d+\.){3}\d+$/.test(redirect.hostname) || redirect.hostname.includes(":");
    if (redirect.username || redirect.password || redirect.search || redirect.hash || redirect.origin !== app.origin || redirect.pathname !== CALLBACK_PATH || (!loopback && (redirect.protocol !== "https:" || privateAddress)) || (loopback && !["http:", "https:"].includes(redirect.protocol))) throw new Error("Invalid callback");
    return { ready: true, reason: null, redirectUri: redirect.toString() };
  } catch { return { ready: false, reason: "Cần tên miền HTTPS staging và callback Google đúng cấu hình", redirectUri: null }; }
}

export function requireGoogleCalendarRedirectUri() {
  const configuration = googleCalendarReadiness();
  if (!configuration.ready || !configuration.redirectUri) throw new Error(configuration.reason || "Google Calendar chưa được cấu hình");
  return configuration.redirectUri;
}
