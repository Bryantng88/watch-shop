import type { ZaloApiResponse } from "./types";

const DEFAULT_ZALO_SEND_URL = "https://openapi.zalo.me/v3.0/oa/group/message";

export async function zaloPost<TBody extends Record<string, any>>(
    body: TBody,
): Promise<ZaloApiResponse> {
    const endpoint = process.env.ZALO_OA_SEND_URL || DEFAULT_ZALO_SEND_URL;
    const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error("Missing ZALO_OA_ACCESS_TOKEN");
    }

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            access_token: accessToken,
        },
        body: JSON.stringify(body),
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
}