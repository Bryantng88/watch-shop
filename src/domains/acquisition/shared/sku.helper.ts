import type { PrismaClient, Prisma } from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export type AcquisitionSkuKind = "WATCH" | "STRAP" | "BOX" | "OTHER";

function normalizeText(value?: string | null) {
    return String(value ?? "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function formatDate(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = String(date.getFullYear());
    return `${dd}${mm}${yyyy}`;
}

function padSeq(value: number) {
    return String(value).padStart(3, "0");
}

function buildWatchBrandPrefix(brandName?: string | null) {
    const normalized = normalizeText(brandName);
    if (!normalized) return "UNK";

    const words = normalized
        .split(/\s+/)
        .map((w) => w.replace(/[^A-Z0-9]/g, ""))
        .filter(Boolean);

    if (!words.length) return "UNK";

    const known: Record<string, string> = {
        OMEGA: "OME",
        ROLEX: "RLX",
        LONGINES: "LNG",
        ORIS: "ORI",
        EXACTLY: "XCT",
        "RAYMOND WEIL": "RMW",
        SEIKO: "SEI",
        CITIZEN: "CTZ",
    };

    const joinedName = words.join(" ");
    if (known[joinedName]) return known[joinedName];
    if (known[words[0]]) return known[words[0]];

    if (words.length >= 2) {
        const initials = words.map((w) => w[0]).join("");
        return initials.slice(0, 3).padEnd(3, "X");
    }

    const single = words[0];
    if (single.length <= 3) return single.padEnd(3, "X");

    const consonants = single.replace(/[AEIOUY]/g, "");
    if (consonants.length >= 3) return consonants.slice(0, 3);

    return single.slice(0, 3).padEnd(3, "X");
}

export function resolveSkuPrefix(input: {
    kind?: AcquisitionSkuKind | null;
    brandName?: string | null;
}) {
    switch (input.kind) {
        case "STRAP":
            return "STR";
        case "BOX":
            return "BOX";
        case "WATCH":
            return buildWatchBrandPrefix(input.brandName);
        default:
            return buildWatchBrandPrefix(input.brandName);
    }
}

export async function genUniqueAcquisitionSku(
    db: DbClient,
    input: {
        kind?: AcquisitionSkuKind | null;
        brandName?: string | null;
        date?: Date;
    }
) {
    const prefix = resolveSkuPrefix({
        kind: input.kind ?? "WATCH",
        brandName: input.brandName,
    });

    const datePart = formatDate(input.date);
    const base = `${prefix}-${datePart}`;

    const rows = await db.product.findMany({
        where: {
            sku: {
                startsWith: `${base}-`,
            },
        },
        select: {
            sku: true,
        },
        orderBy: {
            sku: "desc",
        },
    });

    let maxSeq = 0;

    for (const row of rows) {
        const sku = row.sku ?? "";
        const match = sku.match(new RegExp(`^${base}-(\\d{3})$`));
        if (!match) continue;
        const seq = Number(match[1]);
        if (Number.isFinite(seq) && seq > maxSeq) {
            maxSeq = seq;
        }
    }

    return `${base}-${padSeq(maxSeq + 1)}`;
}