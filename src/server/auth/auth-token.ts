import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_SECONDS = 60 * 60 * 12;

function getSecret() {
    const secret = process.env.AUTH_SECRET;
    if (process.env.NODE_ENV !== "production" && !secret) {
        return "watch-shop-local-development-secret";
    }
    if (!secret || secret.length < 32) return null;
    return secret;
}

function sign(value: string, secret: string) {
    return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAuthToken(userId: string, now = Date.now()) {
    const secret = getSecret();
    if (!secret) {
        throw new Error("AUTH_SECRET must contain at least 32 characters");
    }

    const expiresAt = Math.floor(now / 1000) + TOKEN_TTL_SECONDS;
    const payload = `${userId}.${expiresAt}`;
    return `${payload}.${sign(payload, secret)}`;
}

export function verifyAuthToken(token: string | undefined, now = Date.now()) {
    const secret = getSecret();
    if (!secret || !token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [userId, expiresAtText, signature] = parts;
    const expiresAt = Number(expiresAtText);
    if (!userId || !Number.isSafeInteger(expiresAt)) return null;
    if (expiresAt <= Math.floor(now / 1000)) return null;

    const expected = sign(`${userId}.${expiresAtText}`, secret);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;

    return { userId, expiresAt };
}

export const AUTH_TOKEN_MAX_AGE = TOKEN_TTL_SECONDS;
