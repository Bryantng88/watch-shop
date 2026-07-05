import { prisma } from "@/server/db/client";
import { markWatchPostUsage } from "./watch-post-usage.service";
import { getWatchDownloadGallerySnapshotRepo } from "./watch-download-gallery.repo";

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);

    for (let i = 0; i < 256; i += 1) {
        let c = i;

        for (let k = 0; k < 8; k += 1) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }

        table[i] = c >>> 0;
    }

    return table;
})();

function crc32(buffer: Buffer) {
    let crc = 0xffffffff;

    for (let i = 0; i < buffer.length; i += 1) {
        crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
}

function extensionFromContentType(contentType: string) {
    const normalized = contentType.toLowerCase();

    if (normalized.includes("image/jpeg") || normalized.includes("image/jpg")) {
        return "jpg";
    }
    if (normalized.includes("image/png")) return "png";
    if (normalized.includes("image/webp")) return "webp";
    if (normalized.includes("image/gif")) return "gif";

    return null;
}

function extensionFromKey(fileKey: string) {
    const clean = fileKey.split("?")[0] ?? "";
    const match = clean.match(/\.([a-zA-Z0-9]{2,5})$/);
    return match?.[1]?.toLowerCase() ?? null;
}

function buildZip(entries: Array<{ name: string; data: Buffer }>) {
    const localParts: Buffer[] = [];
    const centralParts: Buffer[] = [];
    let offset = 0;

    for (const entry of entries) {
        const name = Buffer.from(entry.name, "utf8");
        const data = entry.data;
        const crc = crc32(data);

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(0x0800, 6);
        local.writeUInt16LE(0, 8);
        local.writeUInt16LE(0, 10);
        local.writeUInt16LE(0, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(data.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(name.length, 26);
        local.writeUInt16LE(0, 28);

        localParts.push(local, name, data);

        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0x0800, 8);
        central.writeUInt16LE(0, 10);
        central.writeUInt16LE(0, 12);
        central.writeUInt16LE(0, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(data.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(name.length, 28);
        central.writeUInt16LE(0, 30);
        central.writeUInt16LE(0, 32);
        central.writeUInt16LE(0, 34);
        central.writeUInt16LE(0, 36);
        central.writeUInt32LE(0, 38);
        central.writeUInt32LE(offset, 42);

        centralParts.push(central, name);

        offset += local.length + name.length + data.length;
    }

    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const centralOffset = offset;

    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(0, 4);
    end.writeUInt16LE(0, 6);
    end.writeUInt16LE(entries.length, 8);
    end.writeUInt16LE(entries.length, 10);
    end.writeUInt32LE(centralSize, 12);
    end.writeUInt32LE(centralOffset, 16);
    end.writeUInt16LE(0, 20);

    return Buffer.concat([...localParts, ...centralParts, end]);
}

function getReviewStatus(
    reviewStates: Array<{ targetType: string; status: string }>,
    targetType: "IMAGE" | "CONTENT"
) {
    return String(
        reviewStates.find(
            (item) => String(item.targetType).toUpperCase() === targetType
        )?.status ?? "DRAFT"
    ).toUpperCase();
}

async function downloadImage(input: {
    origin: string;
    fileKey: string;
    cookie?: string | null;
}) {
    const url = new URL("/api/media/sign", input.origin);
    url.searchParams.set("key", input.fileKey);

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
        headers: input.cookie ? { cookie: input.cookie } : undefined,
    });

    if (!res.ok) {
        throw new Error(`Không tải được ảnh: ${input.fileKey}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    const buffer = Buffer.from(await res.arrayBuffer());

    if (!buffer.length) {
        throw new Error(`Ảnh rỗng: ${input.fileKey}`);
    }

    return { buffer, contentType };
}

export async function buildWatchGalleryZip(input: {
    productId: string;
    origin: string;
    cookie?: string | null;
}) {
    const snapshot = await getWatchDownloadGallerySnapshotRepo(
        prisma,
        input.productId,
    );

    if (!snapshot) {
        throw new Error("Không tìm thấy watch.");
    }

    if (getReviewStatus(snapshot.reviewStates, "IMAGE") !== "APPROVED") {
        throw new Error("Hình ảnh cần được duyệt trước khi tải gallery.");
    }

    const images = snapshot.product?.productImage ?? [];
    const usableImages = images.filter((image) => String(image.fileKey ?? "").trim());

    if (!usableImages.length) {
        throw new Error("Watch chưa có ảnh GALLERY để tải.");
    }

    const baseName =
        snapshot.product?.sku ||
        snapshot.product?.title ||
        "watch-gallery";
    const entries = [];

    for (let index = 0; index < usableImages.length; index += 1) {
        const image = usableImages[index];
        const fileKey = String(image.fileKey);
        const downloaded = await downloadImage({
            origin: input.origin,
            fileKey,
            cookie: input.cookie,
        });

        const ext =
            extensionFromContentType(downloaded.contentType) ||
            extensionFromKey(fileKey) ||
            "jpg";

        entries.push({
            name: `${baseName}-${String(index + 1).padStart(2, "0")}.${ext}`,
            data: downloaded.buffer,
        });
    }

    const zip = buildZip(entries);
    const usage = await markWatchPostUsage({
        productId: input.productId,
        kind: "IMAGE_DOWNLOADED",
    });

    return {
        buffer: zip,
        filename: `${baseName}-gallery.zip`,
        usage,
    };
}
