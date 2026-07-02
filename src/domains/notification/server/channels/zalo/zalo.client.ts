import type { ZaloApiResponse } from "./types";

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
    const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), resolveTimeoutMs());

    if (!accessToken) {
        clearTimeout(timeout);
        throw new Error("Missing ZALO_OA_ACCESS_TOKEN");
    }

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

        if (data?.error && String(data.error) !== "0") {
            throw new Error(
                data.message ||
                data.error_description ||
                `Zalo API error: ${String(data.error)}`,
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
