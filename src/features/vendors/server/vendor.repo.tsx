import { PrismaClient, Prisma, ProductType } from "@prisma/client";
import prisma from "@/server/db/client";
type Db = typeof prisma | Tx;

export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export const upsertSupplierByNameRoleTx = (db: Db) => async (p: {
    name: string; phone?: string | null; email?: string | null;
}) => {
    const r = await db.vendor.upsert({
        where: { name_role: { name: p.name, role: 'SUPPLIER' } },
        update: { phone: p.phone ?? undefined, email: p.email ?? undefined },
        create: { name: p.name, role: 'SUPPLIER', phone: p.phone ?? null, email: p.email ?? null },
        select: { id: true },
    });
    return r.id;
};