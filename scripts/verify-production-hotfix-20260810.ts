import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deletedProductIds = [
  "cmnfgxxlw001qvkqc2fhuspga", "cmnfgxtbu000yvkqc8g2a8nql",
  "cmnfgxx0g001mvkqcinv9v7s4", "cmnfgxvse001evkqc47aa5pst",
  "cmnfgxtyc0012vkqc0adfkjf0", "cmnfgxwe9001ivkqcjnjsgsho",
  "cmnfgxsp2000uvkqcao9ivr5k", "cmnvmkyl4000rvkmcnolwcbos",
  "cmnfgxuk30016vkqcvp2csxar", "cmnfgxzfe0022vkqcir4hrhrp",
  "cmnfgxytk001yvkqcetdccswu", "cmnfgxy7w001uvkqcw6lm74vf",
  "cmn5qp46m0002vk5c4w79znvv", "cmnwj9uzn000axw7wu9mpmcoz",
  "cmpqdgfe5000jxwdsgj8zfe8r", "cmmu8cxgi001mvkpw6p8r6w0y",
  "cmnajjbn50007vkgg44kn69ep", "cmndiggr5004vvkd0uqzlmcdj",
];

const adjustedAcquisitionIds = [
  "6493cbce-a00b-4669-83aa-c636733a705d", "cmnvmks0v000ovkmcosialyvo",
  "cmndhth540010vkd01upqwbl2", "cmmu8630p0000vkpw23jtxtdg",
  "cmnfgx4wo0005vkqct8elt16n", "cmn4xjccc000bvk44iq531467",
  "cmnajisoc0000vkgguy0o898b", "cmnwj532s0000xwb8l9z1xxm4",
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const [duplicates, deletedProducts, deletedItems, acquisitions, colors, staleRows] =
    await Promise.all([
      prisma.watch.count({ where: { duplicateConfirmedAt: { not: null } } }),
      prisma.product.count({ where: { id: { in: deletedProductIds } } }),
      prisma.acquisitionItem.count({ where: { productId: { in: deletedProductIds } } }),
      prisma.acquisition.findMany({
        where: { id: { in: adjustedAcquisitionIds } },
        select: {
          id: true,
          totalAmount: true,
          acquisitionItem: { select: { quantity: true, unitCost: true } },
        },
      }),
      prisma.strapCatalogOption.count({ where: { kind: "COLOR", isActive: true } }),
      prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint AS count
        FROM "ProjectionRecord" p
        LEFT JOIN "Watch" w ON w.id = p."entityId"
        WHERE p."projectionKey" = 'watch-list'
          AND (w.id IS NULL OR w."duplicateConfirmedAt" IS NOT NULL)
      `,
    ]);

  assert(duplicates === 0, `Expected no confirmed duplicate watches, found ${duplicates}.`);
  assert(deletedProducts === 0, `Expected all purge products deleted, found ${deletedProducts}.`);
  assert(deletedItems === 0, `Expected all purge acquisition items deleted, found ${deletedItems}.`);
  assert(Number(staleRows[0]?.count ?? 0) === 0, "Stale watch-list projection rows remain.");
  assert(colors >= 14, `Expected at least 14 active strap colors, found ${colors}.`);

  const reconciliations = [];
  for (const acquisition of acquisitions) {
    const itemTotal = acquisition.acquisitionItem.reduce(
      (sum, item) => sum + item.quantity * Number(item.unitCost ?? 0), 0,
    );
    const payments = await prisma.payment.findMany({
      where: {
        acquisition_id: acquisition.id,
        direction: "OUT",
        status: { in: ["UNPAID", "PAID", "COLLECTED"] },
      },
      select: { amount: true },
    });
    const paymentTotal = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const acquisitionTotal = Number(acquisition.totalAmount ?? 0);
    assert(acquisitionTotal === itemTotal, `Acquisition ${acquisition.id} total mismatch.`);
    assert(paymentTotal === itemTotal, `Acquisition ${acquisition.id} payment mismatch.`);
    reconciliations.push({ id: acquisition.id, total: itemTotal });
  }

  const [orderItem, invoiceItem, serviceRequests] = await Promise.all([
    prisma.orderItem.findUnique({ where: { id: "59b0d14a-2d3e-49e0-8e3c-7efe868abab0" } }),
    prisma.invoiceItem.findUnique({ where: { id: "cmnwj9yd90017xw7wju72616w" } }),
    prisma.serviceRequest.findMany({
      where: { id: { in: ["c9eb72e8-ddac-428e-a904-19226f18feb5", "94959895-82cf-4257-be40-9426146dfd1a"] } },
    }),
  ]);
  assert(orderItem && !orderItem.productId && !orderItem.variantId, "Order history was not detached cleanly.");
  assert(invoiceItem && !invoiceItem.productId && !invoiceItem.variantId, "Invoice history was not detached cleanly.");
  assert(serviceRequests.length === 2 && serviceRequests.every((row) => !row.productId && !row.variantId), "Service history was not detached cleanly.");

  console.log(JSON.stringify({
    ok: true,
    duplicates,
    deletedProducts,
    deletedItems,
    staleWatchProjectionRows: Number(staleRows[0]?.count ?? 0),
    activeStrapColors: colors,
    reconciliations,
    preservedHistory: { orderItem: 1, invoiceItem: 1, serviceRequests: 2 },
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
