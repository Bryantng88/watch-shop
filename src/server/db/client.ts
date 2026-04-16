import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
    __prisma?: PrismaClient;
};

export const prisma = globalForPrisma.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__prisma = prisma;
}

export type DB = PrismaClient | Prisma.TransactionClient;

export function dbOrTx(db?: DB): DB {
    return db ?? prisma;
}

export function isPrismaClient(db: DB): db is PrismaClient {
    return "$transaction" in db;
}

export async function withDbTransaction<T>(
    db: DB | undefined,
    fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
    const client = dbOrTx(db);

    if (isPrismaClient(client)) {
        return client.$transaction(async (tx) => fn(tx));
    }

    return fn(client);
}