export function isAuthCookieSecure() {
    const configured = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();
    if (configured === "true") return true;
    if (configured === "false") return false;

    const appUrl = process.env.APP_URL?.trim();
    if (appUrl) {
        try {
            return new URL(appUrl).protocol === "https:";
        } catch {
            // Preserve the production-safe default when APP_URL is malformed.
        }
    }

    return process.env.NODE_ENV === "production";
}
