// app/(admin)/admin/customers/_server/customers.repo.ts
import prisma from "@/server/db/client";

export async function findCustomerById(id: string) {
    return prisma.customer.findUnique({
        where: { id }
    });
}

export async function findCustomerByPhone(phone: string) {
    return prisma.customer.findFirst({
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

export async function createCustomer(data: {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
}) {
    return prisma.customer.create({ data });
}

export async function updateCustomer(id: string, data: any) {
    return prisma.customer.update({
        where: { id },
        data
    });
}
