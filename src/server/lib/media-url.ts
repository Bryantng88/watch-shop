const CDN_DOMAIN = process.env.CDN_DOMAIN; // ví dụ: cdn.yoursite.com

export function buildPublicUrl(fileKey: string | null | undefined) {
    if (!fileKey || typeof fileKey !== "string" || !fileKey.trim()) return null;
    if (!CDN_DOMAIN) return null;

    return `https://${CDN_DOMAIN}/${fileKey}`;
}

// dùng cho browser nội bộ
export function buildViewerUrl(fileKey: string | null | undefined) {
    if (!fileKey || typeof fileKey !== "string" || !fileKey.trim()) return null;

    return `/api/media/sign?key=${encodeURIComponent(fileKey)}`;
}

// dùng cho AI / external
export function buildAiUrl(fileKey: string | null | undefined) {
    const url = buildPublicUrl(fileKey);
    if (!url) return null;

    // đảm bảo là absolute URL public
    if (!/^https?:\/\//i.test(url)) return null;
    if (url.includes("localhost")) return null;

    return url;
}