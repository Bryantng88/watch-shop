import { prisma } from "@/server/db/client";

export async function findBrandByNameInsensitive(name: string) {
    return prisma.brand.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
}

export async function findBrandBySlug(slug: string) {
    return prisma.brand.findUnique({
        where: { slug },
        select: {
            id: true,
            slug: true,
        },
    });
}

export async function createBrandRecord(input: {
    name: string;
    slug: string;
}) {
    return prisma.brand.create({
        data: {
            name: input.name,
            slug: input.slug,
            status: "ACTIVE",
            isAuthorized: false,
            sortOrder: 0,

        },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
}

export async function listActiveBrands() {
    return prisma.brand.findMany({
        where: {
            status: "ACTIVE",
        },
        orderBy: [
            { sortOrder: "asc" },
            { name: "asc" },
        ],
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
}