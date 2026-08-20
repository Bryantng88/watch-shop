export const STOREFRONT_INTERNAL_COOKIE = "vintic_internal_analytics";

export function normalizeAnalyticsSource(value: unknown) {
  const source = String(value ?? "").trim().toLowerCase().replace(/^www\./, "");
  if (!source || source === "none" || source === "(direct)" || source === "direct") return "direct";
  if (["ig", "instagram", "instagram.com", "l.instagram.com", "lm.instagram.com", "instagr.am"].includes(source)) return "instagram";
  if (["fb", "facebook", "facebook.com", "m.facebook.com", "l.facebook.com", "lm.facebook.com"].includes(source)) return "facebook";
  if (["t.co", "twitter", "twitter.com", "x", "x.com"].includes(source)) return "x";
  if (source === "google" || source.endsWith(".google.com") || /^google\.[a-z.]+$/.test(source)) return "google";
  if (["zalo", "zalo.me", "zaloapp.com"].includes(source)) return "zalo";
  return source.slice(0, 100);
}
