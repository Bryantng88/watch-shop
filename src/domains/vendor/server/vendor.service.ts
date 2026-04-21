import { prisma } from "@/server/db/client";

export type VendorOption = {
    id: string;
    name: string;
};

export async function getVendorList(): Promise<VendorOption[]> {
    const vendors = await prisma.vendor.findMany({
        orderBy: [{ name: "asc" }],
        select: {
            id: true,
            name: true,
        },
    });

    return vendors.map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
    }));
}

export async function getVendorById(id: string) {
    if (!id) return null;

    return prisma.vendor.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
        },
    });
}

export async function searchVendors(keyword: string): Promise<VendorOption[]> {
    const q = keyword.trim();
    if (!q) return getVendorList();

    const vendors = await prisma.vendor.findMany({
        where: {
            OR: [
                { name: { contains: q, mode: "insensitive" } },
                { contactName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
            ],
        },
        orderBy: [{ name: "asc" }],
        take: 50,
        select: {
            id: true,
            name: true,
        },
    });

    return vendors.map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
    }));
}

export async function ensureVendorExists(id: string) {
    const vendor = await getVendorById(id);

    if (!vendor) {
        throw new Error("Vendor không tồn tại");
    }

    return vendor;
}