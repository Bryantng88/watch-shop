import type { ZaloApiResponse } from "./types";
import { getZaloAccessToken } from "./zalo-token.service";

const DEFAULT_ZALO_SEND_URL = "https://openapi.zalo.me/v3.0/oa/group/message";
const DEFAULT_ZALO_TIMEOUT_MS = 3000;

function resolveTimeoutMs() {
    const raw = Number(process.env.ZALO_OA_TIMEOUT_MS);
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_ZALO_TIMEOUT_MS;
}

export async function zaloPost<TBody extends Record<string, unknown>>(
    body: TBody,
): Promise<ZaloApiResponse> {
    const endpoint = process.env.ZALO_OA_SEND_URL || DEFAULT_ZALO_SEND_URL;
    const accessToken = await getZaloAccessToken();

    try {
        return await zaloPostWithToken(endpoint, body, accessToken);
    } catch (error) {
        if (!isAccessTokenExpiredError(error)) throw error;

        const refreshedAccessToken = await getZaloAccessToken({ forceRefresh: true });
        return zaloPostWithToken(endpoint, body, refreshedAccessToken);
    }
}

async function zaloPostWithToken<TBody extends Record<string, unknown>>(
    endpoint: string,
    body: TBody,
    accessToken: string,
): Promise<ZaloApiResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), resolveTimeoutMs());

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                access_token: accessToken,
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as ZaloApiResponse | null;

        if (!response.ok) {
            throw new Error(data?.message || `Zalo API failed: ${response.status}`);
        }

        const errorCode = data?.error ?? data?.error_code;

        if (errorCode !== undefined && errorCode !== null && String(errorCode) !== "0") {
            throw new Error(
                data?.message ||
                data?.error_description ||
                `Zalo API error: ${String(errorCode)}`,
            );
        }

        return data ?? {};
    } catch (error) {
        if (controller.signal.aborted) {
            throw new Error(`Zalo API timed out after ${resolveTimeoutMs()}ms`);
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

function isAccessTokenExpiredError(error: unknown) {
    if (!(error instanceof Error)) return false;
    return /access token.*expired|token.*expired|expired.*token/i.test(error.message);
}
