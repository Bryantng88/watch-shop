import prisma from "@/server/db/client";

export async function listTechnicalActionOptionsByGroup(
    machineType: "MECHANICAL" | "QUARTZ",
    groupKey: string
) {
    return prisma.technicalActionCatalog.findMany({
        where: {
            isActive: true,
            groupKey,
            OR: [{ appliesTo: "BOTH" }, { appliesTo: machineType }],
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
            id: true,
            code: true,
            name: true,
            appliesTo: true,
            requiresPart: true,
            defaultExecutionMode: true,
        },
    });
}

export async function listTechnicalActionOptions(machineType: "MECHANICAL" | "QUARTZ") {
    return listTechnicalActionOptionsByGroup(machineType, "MOVEMENT");
}

export async function listCrownActionOptions(machineType: "MECHANICAL" | "QUARTZ") {
    return listTechnicalActionOptionsByGroup(machineType, "CROWN");
}

export async function listFunctionalActionOptions(machineType: "MECHANICAL" | "QUARTZ") {
    return listTechnicalActionOptionsByGroup(machineType, "FUNCTIONAL");
}

export async function listTechnicalPartOptions(machineType: "MECHANICAL" | "QUARTZ") {
    return prisma.technicalPartCatalog.findMany({
        where: {
            isActive: true,
            OR: [{ appliesTo: "BOTH" }, { appliesTo: machineType }],
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
            id: true,
            code: true,
            name: true,
            partGroup: true,
        },
    });
}

export async function listAppearanceIssueOptions() {
    const items = await prisma.technicalAppearanceIssueCatalog.findMany({
        where: { isActive: true },
        orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { label: "asc" }],
        select: {
            id: true,
            code: true,
            area: true,
            label: true,
            deductionScore: true,
        },
    });

    return {
        CASE: items.filter((x) => x.area === "CASE"),
        CRYSTAL: items.filter((x) => x.area === "CRYSTAL"),
        DIAL: items.filter((x) => x.area === "DIAL"),
    };
}
