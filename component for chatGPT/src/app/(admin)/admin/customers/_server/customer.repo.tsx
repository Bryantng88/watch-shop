// app/(admin)/admin/customers/_server/customers.repo.ts
import prisma from "@/server/db/client";
import { DB, dbOrTx } from "@/server/db/client";

export async function findCustomerById(tx: DB, id: string) {
    const db = dbOrTx(tx);
    return db.customer.findUnique({
        where: { id }
    });
}

export async function findByPhone(tx: DB, phone: string) {
    const db = dbOrTx(tx);
    return db.customer.findFirst({
        where: { phone },
    });
}
export async function searchCustomers(keyword: string) {
    return prisma.customer.findMany({
        where: {
            OR: [
                { name: { contains: keyword, mode: "insensitive" } },
                { phone: { contains: keyword } },
            ],
        },
        orderBy: { name: "asc" },
        take: 20,
    });
}

export async function listCustomers() {
    return prisma.customer.findMany({
        orderBy: { createdAt: "desc" }
    });
}

export async function createCustomer(
    tx: DB,
    data: {
        name: string;
        phone: string;
        city?: string | null;
        ward?: string | null;
        district?: string | null;
        address?: string | null;
    }
) {
    const db = dbOrTx(tx);
    return db.customer.create({
        data: {
            name: data.name,
            phone: data.phone,
            city: data.city ?? null,
            ward: data.ward ?? null,
            district: data.district ?? null,
            address: data.address ?? null,
        },
    });
}
export async function updateCustomer(
    tx: DB,
    id: string,
    data: {
        city?: string | null;
        district?: string | null;
        ward?: string | null;
        address?: string | null;
    }
) {
    const db = dbOrTx(tx);
    return db.customer.update({
        where: { id },
        data,
    });
}

// customer.repo.ts
export async function searchCustomersByPhone(phone: string) {
    return prisma.customer.findMany({
        where: {
            phone: {
                startsWith: phone,
            },
        },
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            name: true,
            phone: true,
            address: true,
            city: true,
            district: true,
            ward: true,
        },
    });
}
