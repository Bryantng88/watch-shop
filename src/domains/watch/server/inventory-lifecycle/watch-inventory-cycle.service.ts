import { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

const cleanIds = (values: Array<string | null | undefined>) =>
  Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));

/** Ensures legacy/new Watch rows have a durable current lifecycle identity. */
export async function ensureCurrentInventoryCycles(tx: Tx, productIds: string[]) {
  const ids = cleanIds(productIds);
  if (!ids.length) return new Map<string, string>();

  const watches = await tx.watch.findMany({
    where: { productId: { in: ids } },
    select: { productId: true, currentInventoryCycleId: true, createdAt: true },
  });

  for (const watch of watches.filter((row) => !row.currentInventoryCycleId)) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`watch-cycle:${watch.productId}`}, 0))`;
    const current = await tx.watch.findUnique({
      where: { productId: watch.productId },
      select: { currentInventoryCycleId: true },
    });
    if (current?.currentInventoryCycleId) continue;

    const last = await tx.watchInventoryCycle.findFirst({
      where: { productId: watch.productId },
      orderBy: { sequence: "desc" },
      select: { sequence: true },
    });
    const cycle = await tx.watchInventoryCycle.create({
      data: {
        productId: watch.productId,
        sequence: (last?.sequence ?? 0) + 1,
        openedAt: watch.createdAt,
      },
      select: { id: true },
    });
    await tx.watch.update({
      where: { productId: watch.productId },
      data: { currentInventoryCycleId: cycle.id },
    });
  }

  const current = await tx.watch.findMany({
    where: { productId: { in: ids } },
    select: { productId: true, currentInventoryCycleId: true },
  });
  return new Map(current.flatMap((row) => row.currentInventoryCycleId ? [[row.productId, row.currentInventoryCycleId]] : []));
}

/** Opens exactly one new cycle for a posted acquisition item; replay is idempotent. */
export async function openInventoryCycleFromAcquisitionItem(
  tx: Tx,
  input: { productId: string; acquisitionItemId: string; openedAt?: Date },
) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`watch-cycle:${input.productId}`}, 0))`;

  const replay = await tx.watchInventoryCycle.findUnique({
    where: { sourceAcquisitionItemId: input.acquisitionItemId },
    select: { id: true },
  });
  if (replay) return replay;

  const watch = await tx.watch.findUnique({
    where: { productId: input.productId },
    select: { currentInventoryCycleId: true },
  });
  if (!watch) throw new Error(`Watch ${input.productId} does not exist.`);

  const last = await tx.watchInventoryCycle.findFirst({
    where: { productId: input.productId },
    orderBy: { sequence: "desc" },
    select: { sequence: true },
  });
  const openedAt = input.openedAt ?? new Date();

  if (watch.currentInventoryCycleId) {
    await tx.watchInventoryCycle.updateMany({
      where: { id: watch.currentInventoryCycleId, closedAt: null },
      data: { closedAt: openedAt, closeReason: "SUPERSEDED_BY_ACQUISITION" },
    });
  }

  const cycle = await tx.watchInventoryCycle.create({
    data: {
      productId: input.productId,
      sequence: (last?.sequence ?? 0) + 1,
      sourceAcquisitionItemId: input.acquisitionItemId,
      openedAt,
      acquisitionItems: { connect: { id: input.acquisitionItemId } },
    },
    select: { id: true },
  });
  await tx.watch.update({
    where: { productId: input.productId },
    data: { currentInventoryCycleId: cycle.id },
  });
  return cycle;
}

export async function openInventoryCyclesForPostedAcquisition(
  tx: Tx,
  acquisitionId: string,
  options?: { eligibleTradeInProductIds?: string[] },
) {
  const acquisition = await tx.acquisition.findUnique({
    where: { id: acquisitionId },
    select: {
      type: true,
      accquisitionStt: true,
      sentAt: true,
      updatedAt: true,
      acquisitionItem: { select: { id: true, productId: true } },
    },
  });
  if (!acquisition || String(acquisition.accquisitionStt) !== "POSTED") return [];

  const eligibleTradeIns = new Set(options?.eligibleTradeInProductIds ?? []);
  const results: string[] = [];
  for (const item of acquisition.acquisitionItem) {
    if (!item.productId) continue;
    const watch = await tx.watch.findUnique({
      where: { productId: item.productId },
      select: { currentInventoryCycleId: true },
    });
    if (!watch) continue;
    const isReturning = String(acquisition.type) === "BUY_BACK" ||
      (String(acquisition.type) === "TRADE_IN" && eligibleTradeIns.has(item.productId));
    if (!isReturning && watch.currentInventoryCycleId) {
      await tx.acquisitionItem.update({ where: { id: item.id }, data: { inventoryCycleId: watch.currentInventoryCycleId } });
      continue;
    }
    const cycle = await openInventoryCycleFromAcquisitionItem(tx, {
      productId: item.productId,
      acquisitionItemId: item.id,
      openedAt: acquisition.sentAt ?? acquisition.updatedAt,
    });
    results.push(cycle.id);
  }
  return results;
}
