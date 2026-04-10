export async function fetchImageAsDataUrl(url: string, origin: string) {
    const full = url.startsWith("http") ? url : `${origin}${url}`;
    const res = await fetch(full);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
}

export async function resolveContentImagesAsDataUrls(
    images: any[],
    origin: string
) {
    const list = (images ?? []).slice(0, 2);

    const settled = await Promise.allSettled(
        list.map((img) => fetchImageAsDataUrl(img.url, origin))
    );

    return settled
        .filter((x: any) => x.status === "fulfilled")
        .map((x: any) => x.value);
}