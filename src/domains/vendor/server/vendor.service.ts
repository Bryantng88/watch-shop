import { prisma } from "@/server/db/client";

export type VendorOption = {
    id: string;
    name: string;
    phone?: string | null;
};

function cleanText(value: unknown) {
    return String(value ?? "").trim();
}

function normalizeVendor(vendor: {
    id: string;
    name: string;
    phone?: string | null;
}): VendorOption {
    return {
        id: vendor.id,
        name: vendor.name,
        phone: vendor.phone ?? null,
    };
}

export async function getVendorList(): Promise<VendorOption[]> {
    const vendors = await prisma.vendor.findMany({
        orderBy: [{ name: "asc" }],
        select: {
            id: true,
            name: true,
            phone: true,
        },
    });

    return vendors.map(normalizeVendor);
}

export async function getVendorById(id: string) {
    if (!id) return null;

    return prisma.vendor.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            phone: true,
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
            phone: true,
        },
    });

    return vendors.map(normalizeVendor);
}

export async function createVendorQuick(input: {
    name: string;
    phone?: string | null;
}): Promise<VendorOption> {
    const name = cleanText(input.name);
    const phone = cleanText(input.phone) || null;

    if (!name) {
        throw new Error("Vui lòng nhập tên vendor.");
    }

    const existing = await prisma.vendor.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            name: true,
            phone: true,
        },
    });

    if (existing) return normalizeVendor(existing);

    const vendor = await prisma.vendor.create({
        data: {
            name,
            phone,
        },
        select: {
            id: true,
            name: true,
            phone: true,
        },
    });

    return normalizeVendor(vendor);
}

export async function ensureVendorExists(id: string) {
    const vendor = await getVendorById(id);

    if (!vendor) {
        throw new Error("Vendor không tồn tại");
    }

    return vendor;
}
