import { z } from "zod";
import { InvoiceType, InvoiceStatus } from "@prisma/client";

// ===== ITEM DTO =====
export const InvoiceItemDTO = z.object({
    title: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    discount: z.number().min(0).default(0),
    taxRate: z.number().min(0).default(0),
    description: z.string().nullable().optional(),
    productId: z.string().optional(),
    variantId: z.string().optional()
});

export const UpdateInvoiceItemDTO = InvoiceItemDTO.partial();

// ===== HEADER DTO =====
export const CreateInvoiceDTO = z.object({
    type: z.nativeEnum(InvoiceType),
    status: z.nativeEnum(InvoiceStatus).default("DRAFT"),
    customerId: z.string().optional(),
    vendorId: z.string().optional(),
    orderId: z.string().optional(),
    acquisitionId: z.string().optional(),
    serviceRequestId: z.string().optional(),
    currency: z.string().default("VND"),
    notes: z.string().nullable().optional(),
    issuedAt: z.coerce.date().optional(),
    dueAt: z.coerce.date().optional(),
    items: z.array(InvoiceItemDTO).default([]),
});

export const UpdateInvoiceDTO = CreateInvoiceDTO.partial();
