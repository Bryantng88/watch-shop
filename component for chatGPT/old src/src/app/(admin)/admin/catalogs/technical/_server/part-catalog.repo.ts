import prisma from "@/server/db/client";

function slugCode(text: string) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .map((x) => x.toUpperCase())
        .join("_");
}

export async function generateUniquePartCode(name: string) {
    const prefix = slugCode(name).slice(0, 18) || "PART";

    const count = await prisma.mechanicalPartCatalog.count({
        where: {
            code: {
                startsWith: prefix,
            },
        },
    });

    return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}

export async function createPartCatalogRepo(input: {
    name: string;
    appliesTo: string;
    group: string;
    sortOrder?: number | null;
    note?: string | null;
    isActive?: boolean;
}) {
    const code = await generateUniquePartCode(input.name);

    return prisma.mechanicalPartCatalog.create({
        data: {
            code,
            name: input.name.trim(),
            appliesTo: input.appliesTo as any,
            group: input.group as any,
            sortOrder: input.sortOrder ?? 0,
            note: input.note?.trim() || null,
            isActive: input.isActive ?? true,
        } as any,
    });
}

export async function updatePartCatalogRepo(
    id: string,
    input: {
        name: string;
        appliesTo: string;
        group: string;
        sortOrder?: number | null;
        note?: string | null;
        isActive?: boolean;
    }
) {
    return prisma.mechanicalPartCatalog.update({
        where: { id },
        data: {
            name: input.name.trim(),
            appliesTo: input.appliesTo as any,
            group: input.group as any,
            sortOrder: input.sortOrder ?? 0,
            note: input.note?.trim() || null,
            isActive: input.isActive ?? true,
        } as any,
    });
}