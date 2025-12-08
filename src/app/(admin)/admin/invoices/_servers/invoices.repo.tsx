import { Prisma, InvoiceStatus } from "@prisma/client";
import { CreateInvoiceDTO, UpdateInvoiceDTO, InvoiceItemDTO, UpdateInvoiceItemDTO } from "./invoice.dto";
import prisma, { DB, dbOrTx } from "@/server/db/client";
import { genRefNo } from "../../components/AutoGenRef";
import z from "zod";


export async function createInvoiceDraft(tx: DB, input: z.infer<typeof CreateInvoiceDTO>) {
  const db = dbOrTx(tx);
  const dto = CreateInvoiceDTO.parse(input);

  const subTotal = dto.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxTotal = dto.items.reduce((s, i) => s + (i.taxRate / 100) * i.quantity * i.unitPrice, 0);
  const discountTotal = dto.items.reduce((s, i) => s + i.discount, 0);
  const grandTotal = subTotal + taxTotal - discountTotal;

  return db.invoice.create({
    data: {
      type: dto.type,
      status: dto.status ?? "DRAFT",
      vendorId: dto.vendorId,
      customerId: dto.customerId,
      orderId: dto.orderId,
      acquisitionId: dto.acquisitionId,
      serviceRequestId: dto.serviceRequestId,
      currency: dto.currency,
      notes: dto.notes,
      issuedAt: dto.issuedAt,
      dueAt: dto.dueAt,
      subTotal,
      taxTotal,
      discountTotal,
      grandTotal,
      items: {
        create: dto.items.map(i => ({
          title: i.title,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount,
          taxRate: i.taxRate,
          description: i.description,
          productId: i.productId,
          variantId: i.variantId,
          lineTotal: (i.quantity * i.unitPrice) - i.discount + ((i.quantity * i.unitPrice) * i.taxRate / 100)
        }))
      }
    },
    select: { id: true }
  });
}



export async function updateInvoice(
  tx: DB,
  id: string,
  input: z.infer<typeof UpdateInvoiceDTO>
) {
  const db = dbOrTx(tx);
  const dto = UpdateInvoiceDTO.parse(input);

  const data: Prisma.InvoiceUpdateInput = {
    ...(dto.type && { type: dto.type }),
    ...(dto.status && { status: dto.status }),
    ...(dto.currency && { currency: dto.currency }),
    ...(dto.notes !== undefined && { notes: dto.notes }),
    ...(dto.issuedAt && { issuedAt: dto.issuedAt }),
    ...(dto.dueAt && { dueAt: dto.dueAt }),

    ...(dto.vendorId && {
      vendor: { connect: { id: dto.vendorId } },
    }),
    ...(dto.customerId && {
      customer: { connect: { id: dto.customerId } },
    }),
    ...(dto.orderId && {
      order: { connect: { id: dto.orderId } },
    }),
    ...(dto.acquisitionId && {
      acquisition: { connect: { id: dto.acquisitionId } },
    }),
    ...(dto.serviceRequestId && {
      serviceReq: { connect: { id: dto.serviceRequestId } },
    }),

    // ❗ KHÔNG xử lý items ở đây
    // items update/add/delete dùng repo riêng:
    // addInvoiceItem / updateInvoiceItem / deleteInvoiceItems / recalcInvoiceTotals
  };

  return db.invoice.update({
    where: { id },
    data,
  });
}


export async function addInvoiceItem(tx: DB, invoiceId: string, input: z.infer<typeof InvoiceItemDTO>) {
  const db = dbOrTx(tx);
  const dto = InvoiceItemDTO.parse(input);

  const lineTotal =
    dto.quantity * dto.unitPrice -
    (dto.discount || 0) +
    (dto.quantity * dto.unitPrice * (dto.taxRate || 0) / 100);

  return db.invoiceItem.create({
    data: {
      invoiceId,
      title: dto.title,
      description: dto.description,
      quantity: dto.quantity,
      unitPrice: dto.unitPrice,
      discount: dto.discount,
      taxRate: dto.taxRate,
      productId: dto.productId,
      variantId: dto.variantId,
      lineTotal
    }
  });
}

export async function updateInvoiceItem(tx: DB, itemId: string, input: z.infer<typeof UpdateInvoiceItemDTO>) {
  const db = dbOrTx(tx);
  const dto = UpdateInvoiceItemDTO.parse(input);

  // recalc line
  let lineTotal: number | undefined = undefined;
  if (dto.unitPrice !== undefined || dto.quantity !== undefined || dto.discount !== undefined || dto.taxRate !== undefined) {
    const existing = await db.invoiceItem.findUnique({ where: { id: itemId } });
    if (existing) {
      const q = dto.quantity ?? Number(existing.quantity);
      const u = dto.unitPrice ?? Number(existing.unitPrice);
      const d = dto.discount ?? Number(existing.discount);
      const t = dto.taxRate ?? Number(existing.taxRate);

      lineTotal = q * u - d + q * u * (t / 100);
    }
  }

  return db.invoiceItem.update({
    where: { id: itemId },
    data: { ...dto, ...(lineTotal !== undefined ? { lineTotal } : {}) }
  });
}

export async function deleteInvoiceItems(tx: DB, ids: string[]) {
  if (!ids?.length) return;
  const db = dbOrTx(tx);
  await db.invoiceItem.deleteMany({ where: { id: { in: ids } } });
}


export async function recalcInvoiceTotals(tx: DB, invoiceId: string) {
  const db = dbOrTx(tx);

  const items = await db.invoiceItem.findMany({
    where: { invoiceId }
  });

  const subTotal = items.reduce((s, i) => s + Number(i.quantity) * Number(i.unitPrice), 0);
  const discountTotal = items.reduce((s, i) => s + Number(i.discount), 0);
  const taxTotal = items.reduce((s, i) => s + (Number(i.taxRate) / 100) * Number(i.quantity) * Number(i.unitPrice), 0);
  const grandTotal = subTotal + taxTotal - discountTotal;

  return db.invoice.update({
    where: { id: invoiceId },
    data: { subTotal, discountTotal, taxTotal, grandTotal },
    select: { id: true, grandTotal: true }
  });
}


export async function postInvoice(tx: DB, id: string) {
  const db = dbOrTx(tx);

  const refNo = await genRefNo(db, {
    model: db.invoice,
    prefix: "INV"
  });

  return db.invoice.update({
    where: { id },
    data: {
      status: "ISSUED",
      code: refNo,
      issuedAt: new Date()
    },
    select: { id: true, status: true }
  });
}

export async function getInvoiceList(tx: DB, where: Prisma.InvoiceWhereInput, orderBy: Prisma.InvoiceOrderByWithRelationInput[], skip: number, take: number) {
  const db = dbOrTx(tx);
  const [rows, total] = await Promise.all([
    db.invoice.findMany({
      where, orderBy, skip, take,
      include: {
        vendor: true,
        customer: true,
        _count: { select: { items: true, payments: true } }
      }
    }),
    db.invoice.count({ where })
  ]);

  return { rows, total };
}


export async function getInvoiceById(tx: DB, id: string) {
  const db = dbOrTx(tx);
  return db.invoice.findUnique({
    where: { id },
    include: {
      vendor: true,
      customer: true,
      order: true,
      acquisition: true,
      items: true,
      payments: true
    }
  });
}


export async function createInvoiceFromAcquisition(tx: DB, acqId: string) {
  const db = dbOrTx(tx);

  const acq = await db.acquisition.findUnique({
    where: { id: acqId },
    include: { acquisitionItem: true, vendor: true }
  });

  if (!acq) throw new Error("Acquisition not found");

  const dto = CreateInvoiceDTO.parse({
    type: "PURCHASE",      // literal
    status: "DRAFT",
    vendorId: acq.vendorId ?? undefined,
    currency: acq.currency,
    notes: `Invoice from acquisition ${acq.refNo ?? ""}`,
    items: acq.acquisitionItem.map(i => ({
      title: i.productTitle,
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitCost),
      discount: 0,
      taxRate: 0,
      productId: i.productId ?? undefined,
      variantId: i.variantId ?? undefined,
    })),
  });

  return createInvoiceDraft(tx, dto);
}
