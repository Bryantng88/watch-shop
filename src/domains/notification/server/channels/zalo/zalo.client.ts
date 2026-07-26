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
    options?: { signal?: AbortSignal },
): Promise<ZaloApiResponse> {
    options?.signal?.throwIfAborted();
    const endpoint = process.env.ZALO_OA_SEND_URL || DEFAULT_ZALO_SEND_URL;
    const accessToken = await getZaloAccessToken();
    options?.signal?.throwIfAborted();

    try {
        return await zaloPostWithToken(endpoint, body, accessToken, options?.signal);
    } catch (error) {
        if (!isAccessTokenExpiredError(error)) throw error;

        const refreshedAccessToken = await getZaloAccessToken({ forceRefresh: true });
        options?.signal?.throwIfAborted();
        return zaloPostWithToken(endpoint, body, refreshedAccessToken, options?.signal);
    }
}

async function zaloPostWithToken<TBody extends Record<string, unknown>>(
    endpoint: string,
    body: TBody,
    accessToken: string,
    parentSignal?: AbortSignal,
): Promise<ZaloApiResponse> {
    const controller = new AbortController();
    const abortFromParent = () => controller.abort(parentSignal?.reason);
    parentSignal?.addEventListener("abort", abortFromParent, { once: true });
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
        parentSignal?.removeEventListener("abort", abortFromParent);
    }
}

function isAccessTokenExpiredError(error: unknown) {
    if (!(error instanceof Error)) return false;
    return /access token.*expired|token.*expired|expired.*token/i.test(error.message);
}
