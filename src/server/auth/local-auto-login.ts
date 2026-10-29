type LocalLoginEnvironment = {
    NODE_ENV?: string;
    LOCAL_AUTO_LOGIN?: string;
    DATABASE_URL?: string;
    DIRECT_URL?: string;
};

export function isLoopbackHost(authority: string | null): boolean {
    if (!authority) return false;
    try {
        const url = new URL(`http://${authority}`);
        return !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash &&
            ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    } catch {
        return false;
    }
}

export function isLocalAutoLoginEnabled(env: LocalLoginEnvironment = process.env): boolean {
    if (env.NODE_ENV !== "development" || env.LOCAL_AUTO_LOGIN !== "true") return false;
    return [env.DATABASE_URL, env.DIRECT_URL].every((value) => {
        if (!value) return false;
        try {
            const url = new URL(value);
            return ["postgres:", "postgresql:"].includes(url.protocol) && isLoopbackHost(url.host) &&
                /(?:local|test|storefront)/i.test(url.pathname);
        } catch {
            return false;
        }
    });
}

export function isLocalAutoLoginRequestAllowed(request: Request, env: LocalLoginEnvironment = process.env): boolean {
    if (!isLocalAutoLoginEnabled(env)) return false;
    const host = request.headers.get("host");
    if (!isLoopbackHost(host) || !isLoopbackHost(new URL(request.url).host)) return false;
    const forwardedHost = request.headers.get("x-forwarded-host");
    if (forwardedHost && forwardedHost.split(",").some((value) => !isLoopbackHost(value.trim()))) return false;
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor && forwardedFor.split(",").some((value) => !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(value.trim()))) return false;
    try {
        const origin = new URL(request.headers.get("origin") ?? "");
        return origin.protocol === "http:" && isLoopbackHost(origin.host) && origin.host === host &&
            !["cross-site", "same-site"].includes(request.headers.get("sec-fetch-site") ?? "");
    } catch {
        return false;
    }
}
