import { Prisma, PrismaClient } from "@prisma/client";

function databasePoolConfig() {
    const raw = String(process.env.DATABASE_URL ?? "").trim();
    if (!raw) return null;
    try {
        const url = new URL(raw);
        const connectionLimitRaw = url.searchParams.get("connection_limit");
        const poolTimeoutRaw = url.searchParams.get("pool_timeout");
        const connectionLimit = connectionLimitRaw === null
            ? null
            : Number(connectionLimitRaw);
        const poolTimeout = poolTimeoutRaw === null
            ? null
            : Number(poolTimeoutRaw);
        return {
            connectionLimit:
                connectionLimit !== null && Number.isFinite(connectionLimit)
                    ? connectionLimit
                    : null,
            poolTimeout:
                poolTimeout !== null && Number.isFinite(poolTimeout)
                    ? poolTimeout
                    : null,
        };
    } catch {
        return null;
    }
}

const poolConfig = databasePoolConfig();
if (
    process.env.NODE_ENV !== "production" &&
    poolConfig &&
    (
        (poolConfig.connectionLimit !== null && poolConfig.connectionLimit < 4) ||
        poolConfig.poolTimeout === 0
    )
) {
    console.warn("[database-pool] Development pool is undersized for concurrent admin reads", {
        connectionLimit: poolConfig.connectionLimit,
        poolTimeout: poolConfig.poolTimeout,
    });
}

const globalForPrisma = globalThis as typeof globalThis & {
    __prisma?: PrismaClient;
};

export const prisma = globalForPrisma.__prisma ?? new PrismaClient();

// Compatibility for older server modules while they migrate to named imports.
export default prisma;

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__prisma = prisma;
}

export type DB = PrismaClient | Prisma.TransactionClient;
export type Tx = Prisma.TransactionClient;

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
