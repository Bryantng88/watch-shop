import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const parsed = new URL(databaseUrl);
if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error("Refusing to import outside a loopback database");
}
if (!/(test|storefront)/i.test(parsed.pathname)) {
  throw new Error("Refusing a database whose name is not explicitly test/storefront");
}

const snapshotPath = process.argv[2];
if (!snapshotPath) throw new Error("Usage: tsx scripts/import-staging-storefront-subset.ts <snapshot.json|->");

const tableOrder = [
  "Brand",
  "Product",
  "ProductContent",
  "ProductImage",
  "ProductVariant",
  "Watch",
  "WatchContent",
  "WatchPrice",
  "WatchSpecV2",
  "WatchReviewState",
] as const;

async function readSnapshot() {
  if (snapshotPath !== "-") return readFile(snapshotPath, "utf8");
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const snapshot = JSON.parse(await readSnapshot()) as {
    format?: number;
    source?: string;
    tables?: Record<string, unknown[]>;
  };
  if (snapshot.format !== 1 || snapshot.source !== "staging-storefront-sanitized-subset" || !snapshot.tables) {
    throw new Error("Unsupported or unsafe staging snapshot");
  }
  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  try {
    const counts: Record<string, number> = {};
    await prisma.$transaction(async (tx) => {
      for (const table of [...tableOrder].reverse()) {
        await tx.$executeRawUnsafe(`DELETE FROM "${table}"`);
      }
      for (const table of tableOrder) {
        const rows = snapshot.tables?.[table] ?? [];
        if (rows.length) {
          await tx.$executeRawUnsafe(
            `INSERT INTO "${table}" SELECT * FROM json_populate_recordset(NULL::"${table}", $1::json) ON CONFLICT DO NOTHING`,
            JSON.stringify(rows),
          );
        }
        counts[table] = rows.length;
      }
    });
    console.log(JSON.stringify({ ok: true, database: parsed.pathname.slice(1), counts }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
