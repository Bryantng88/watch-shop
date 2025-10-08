// /server/lib/image-url.ts
const CDN_DOMAIN = process.env.CDN_DOMAIN!; // ví dụ cdn.example.com
const BUCKET_PREFIX = process.env.IMG_PREFIX ?? ""; // optional "products/"

export function publicImageUrlFromKey(key: string) {
    // Public bucket + CDN: URL là cố định, chỉ nối domain + key.
    return `https://${CDN_DOMAIN}/${BUCKET_PREFIX}${key}`;
}
