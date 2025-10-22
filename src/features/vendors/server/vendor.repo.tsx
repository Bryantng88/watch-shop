import prisma from "@/server/db/client";

export async function upsertSupplierByNameRole(input: {
    name: string;
    phone?: string | null;
    email?: string | null;
}) {
    const v = await prisma.vendor.upsert({
        where: { name_role: { name: input.name, role: "SUPPLIER" } },
        update: { phone: input.phone ?? undefined, email: input.email ?? undefined },
        create: { name: input.name, role: "SUPPLIER", phone: input.phone ?? null, email: input.email ?? null },
        select: { id: true },
    });
    return v.id;
}
