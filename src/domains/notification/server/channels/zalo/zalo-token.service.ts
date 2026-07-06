import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import type { ZaloTokenResponse } from "./types";

const TOKEN_CONTROL_KEY = "zalo_oa_token";
const TOKEN_CONTROL_LABEL = "Zalo OA Token";
const DEFAULT_ZALO_TOKEN_URL = "https://oauth.zaloapp.com/v4/oa/access_token";
const REFRESH_BUFFER_MS = 10 * 60 * 1000;

type ZaloTokenMetadata = {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
    lastRefreshAt?: string;
    lastRefreshError?: string | null;
};

let refreshPromise: Promise<string> | null = null;

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

function metadataFromJson(value: unknown): ZaloTokenMetadata {
    const record = asRecord(value);

    return {
        accessToken: clean(record.accessToken) || undefined,
        refreshToken: clean(record.refreshToken) || undefined,
        expiresAt: clean(record.expiresAt) || undefined,
        lastRefreshAt: clean(record.lastRefreshAt) || undefined,
        lastRefreshError: record.lastRefreshError === null
            ? null
            : clean(record.lastRefreshError) || undefined,
    };
}

function isUsableAccessToken(metadata: ZaloTokenMetadata) {
    if (!metadata.accessToken) return false;
    if (!metadata.expiresAt) return true;

    const expiresAtMs = Date.parse(metadata.expiresAt);
    if (!Number.isFinite(expiresAtMs)) return false;

    return expiresAtMs - Date.now() > REFRESH_BUFFER_MS;
}

async function readStoredTokenMetadata() {
    const row = await prisma.systemJobControl.findUnique({
        where: { key: TOKEN_CONTROL_KEY },
        select: { metadata: true },
    });

    return metadataFromJson(row?.metadata);
}

async function saveTokenMetadata(metadata: ZaloTokenMetadata) {
    const jsonMetadata: Record<string, string | null> = {};

    if (metadata.accessToken) jsonMetadata.accessToken = metadata.accessToken;
    if (metadata.refreshToken) jsonMetadata.refreshToken = metadata.refreshToken;
    if (metadata.expiresAt) jsonMetadata.expiresAt = metadata.expiresAt;
    if (metadata.lastRefreshAt) jsonMetadata.lastRefreshAt = metadata.lastRefreshAt;
    if (metadata.lastRefreshError !== undefined) {
        jsonMetadata.lastRefreshError = metadata.lastRefreshError;
    }

    await prisma.systemJobControl.upsert({
        where: { key: TOKEN_CONTROL_KEY },
        create: {
            key: TOKEN_CONTROL_KEY,
            label: TOKEN_CONTROL_LABEL,
            enabled: true,
            batchSize: 1,
            pausedReason: null,
            metadata: jsonMetadata as Prisma.InputJsonObject,
        },
        update: {
            enabled: true,
            metadata: jsonMetadata as Prisma.InputJsonObject,
            updatedAt: new Date(),
        },
    });
}

function getEnvRefreshToken() {
    return clean(process.env.ZALO_OA_REFRESH_TOKEN);
}

function getConfiguredRefreshToken(metadata: ZaloTokenMetadata) {
    return metadata.refreshToken || getEnvRefreshToken();
}

function getConfiguredAppId() {
    return clean(process.env.ZALO_APP_ID);
}

function getConfiguredAppSecret() {
    return clean(process.env.ZALO_APP_SECRET);
}

function tokenEndpoint() {
    return clean(process.env.ZALO_OA_TOKEN_URL) || DEFAULT_ZALO_TOKEN_URL;
}

function parseExpiresAt(expiresIn: unknown) {
    const seconds = Number(expiresIn);
    const safeSeconds = Number.isFinite(seconds) && seconds > 0
        ? seconds
        : 25 * 60 * 60;

    return new Date(Date.now() + safeSeconds * 1000).toISOString();
}

function zaloTokenError(data: ZaloTokenResponse | null) {
    const errorCode = data?.error ?? data?.error_code;
    if (errorCode === undefined || errorCode === null || String(errorCode) === "0") {
        return null;
    }

    return data?.message ||
        data?.error_description ||
        `Zalo token API error: ${String(errorCode)}`;
}

async function requestZaloAccessToken(refreshToken: string) {
    const appId = getConfiguredAppId();
    const appSecret = getConfiguredAppSecret();

    if (!appId) throw new Error("Missing ZALO_APP_ID");
    if (!appSecret) throw new Error("Missing ZALO_APP_SECRET");

    const body = new URLSearchParams();
    body.set("refresh_token", refreshToken);
    body.set("app_id", appId);
    body.set("grant_type", "refresh_token");

    const response = await fetch(tokenEndpoint(), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            secret_key: appSecret,
        },
        body,
    });

    const data = (await response.json().catch(() => null)) as ZaloTokenResponse | null;

    if (!response.ok) {
        throw new Error(data?.message || `Zalo token API failed: ${response.status}`);
    }

    const apiError = zaloTokenError(data);
    if (apiError) throw new Error(apiError);

    const accessToken = clean(data?.access_token);
    if (!accessToken) throw new Error("Zalo token API did not return access_token");

    return {
        accessToken,
        refreshToken: clean(data?.refresh_token) || refreshToken,
        expiresAt: parseExpiresAt(data?.expires_in),
    };
}

async function refreshZaloAccessToken() {
    const current = await readStoredTokenMetadata();
    const refreshTokens = Array.from(
        new Set([current.refreshToken, getEnvRefreshToken()].map(clean).filter(Boolean)),
    );

    if (!refreshTokens.length) throw new Error("Missing ZALO_OA_REFRESH_TOKEN");

    let lastError: unknown = null;

    for (const refreshToken of refreshTokens) {
        try {
            const refreshed = await requestZaloAccessToken(refreshToken);
            const nextMetadata: ZaloTokenMetadata = {
                accessToken: refreshed.accessToken,
                refreshToken: refreshed.refreshToken,
                expiresAt: refreshed.expiresAt,
                lastRefreshAt: new Date().toISOString(),
                lastRefreshError: null,
            };

            await saveTokenMetadata(nextMetadata);
            return refreshed.accessToken;
        } catch (error) {
            lastError = error;
        }
    }

    const fallbackRefreshToken = refreshTokens[refreshTokens.length - 1];
    await saveTokenMetadata({
        ...current,
        refreshToken: fallbackRefreshToken,
        lastRefreshAt: current.lastRefreshAt,
        lastRefreshError: errorMessage(lastError),
    });
    throw lastError instanceof Error ? lastError : new Error("Zalo token refresh failed");
}

export async function getZaloAccessToken(input?: { forceRefresh?: boolean }) {
    if (!input?.forceRefresh) {
        const stored = await readStoredTokenMetadata();
        if (isUsableAccessToken(stored)) return stored.accessToken as string;

        const envAccessToken = clean(process.env.ZALO_OA_ACCESS_TOKEN);
        if (envAccessToken && !getConfiguredRefreshToken(stored)) return envAccessToken;
    }

    if (!refreshPromise) {
        refreshPromise = refreshZaloAccessToken().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export async function getZaloTokenStatus() {
    const metadata = await readStoredTokenMetadata();
    const hasEnvAccessToken = Boolean(clean(process.env.ZALO_OA_ACCESS_TOKEN));
    const hasRefreshToken = Boolean(getConfiguredRefreshToken(metadata));
    const hasEnvRefreshToken = Boolean(getEnvRefreshToken());

    return {
        configured: hasEnvAccessToken || hasRefreshToken,
        hasRefreshToken,
        hasEnvRefreshToken,
        hasStoredAccessToken: Boolean(metadata.accessToken),
        hasStoredRefreshToken: Boolean(metadata.refreshToken),
        expiresAt: metadata.expiresAt ?? null,
        lastRefreshAt: metadata.lastRefreshAt ?? null,
        lastRefreshError: metadata.lastRefreshError ?? null,
        refreshBufferMinutes: Math.round(REFRESH_BUFFER_MS / 60000),
    };
}
