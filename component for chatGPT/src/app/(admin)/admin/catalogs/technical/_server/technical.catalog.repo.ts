import { prisma } from "@/server/db/client";

export async function listTechnicalActionCatalog() {
    return prisma.technicalActionCatalog.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
}

export async function listTechnicalPartCatalog() {
    return prisma.technicalPartCatalog.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
}

export async function listTechnicalAppearanceIssueCatalog() {
    return prisma.technicalAppearanceIssueCatalog.findMany({
        orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { label: "asc" }],
    });
}

export async function upsertTechnicalActionCatalog(input: any) {
    const data = {
        code: String(input.code || "").trim(),
        name: String(input.name || "").trim(),
        appliesTo: String(input.appliesTo || "BOTH").trim(),
        groupKey: String(input.groupKey || "MOVEMENT").trim(),
        requiresPart: Boolean(input.requiresPart),
        defaultExecutionMode: input.defaultExecutionMode
            ? String(input.defaultExecutionMode)
            : null,
        sortOrder: Number(input.sortOrder || 0),
        isActive: input.isActive !== false,
        note: input.note ? String(input.note) : null,
    };

    if (!data.code || !data.name) {
        throw new Error("Thiếu code hoặc name");
    }

    if (input.id) {
        return prisma.technicalActionCatalog.update({
            where: { id: String(input.id) },
            data,
        });
    }

    return prisma.technicalActionCatalog.upsert({
        where: { code: data.code },
        update: data,
        create: data,
    });
}

export async function upsertTechnicalPartCatalog(input: any) {
    const data = {
        code: String(input.code || "").trim(),
        name: String(input.name || "").trim(),
        appliesTo: String(input.appliesTo || "BOTH").trim(),
        partGroup: String(input.partGroup || "MOVEMENT").trim(),
        sortOrder: Number(input.sortOrder || 0),
        isActive: input.isActive !== false,
        note: input.note ? String(input.note) : null,
    };

    if (!data.code || !data.name) {
        throw new Error("Thiếu code hoặc name");
    }

    if (input.id) {
        return prisma.technicalPartCatalog.update({
            where: { id: String(input.id) },
            data,
        });
    }

    return prisma.technicalPartCatalog.upsert({
        where: { code: data.code },
        update: data,
        create: data,
    });
}

export async function upsertTechnicalAppearanceIssueCatalog(input: any) {
    const data = {
        code: String(input.code || "").trim(),
        area: String(input.area || "CASE").trim(),
        label: String(input.label || "").trim(),
        deductionScore: Number(input.deductionScore || 0),
        sortOrder: Number(input.sortOrder || 0),
        isActive: input.isActive !== false,
        note: input.note ? String(input.note) : null,
    };

    if (!data.code || !data.label) {
        throw new Error("Thiếu code hoặc label");
    }

    if (input.id) {
        return prisma.technicalAppearanceIssueCatalog.update({
            where: { id: String(input.id) },
            data,
        });
    }

    return prisma.technicalAppearanceIssueCatalog.upsert({
        where: { code: data.code },
        update: data,
        create: data,
    });
}