import { prisma } from "@/server/db/client";
import { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient | typeof prisma;

export async function listServiceCatalogRepo(
    db: Tx = prisma,
    opts?: {
        isActive?: boolean;
    }
) {
    return db.serviceCatalog.findMany({
        where: {
            ...(opts?.isActive !== undefined
                ? { isActive: opts.isActive }
                : {}),
        },
        orderBy: { name: "asc" },
        select: {
            id: true,
            code: true,
            name: true,
            description: true,
            detail: true,          // enum ServiceDetail
            defaultPrice: true,
            durationMin: true,
            isActive: true,
        },
    });
}
