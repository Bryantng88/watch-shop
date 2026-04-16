// features/media/utils.ts
import { PUBLIC_BASE } from "@/server/s3";

export function imageUrlToKey(url?: string | null) {
    if (!url) return null;

    // ví dụ: https://cdn.xxx.com/abc/def.png
    if (url.startsWith(PUBLIC_BASE)) {
        return url.replace(`${PUBLIC_BASE}/`, "");
    }

    return url; // fallback nếu đã là key
}
