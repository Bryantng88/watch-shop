import * as z from 'zod';

import { InvoiceTypeSchema } from '../../enums/InvoiceType.schema';
import { InvoiceStatusSchema } from '../../enums/InvoiceStatus.schema';
// prettier-ignore
export const InvoiceResultSchema = z.object({
    id: z.string(),
    code: z.string().nullable(),
    type: InvoiceTypeSchema,
    status: InvoiceStatusSchema,
    customerId: z.string().nullable(),
    vendorId: z.string().nullable(),
    orderId: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    currency: z.string(),
    subTotal: z.number(),
    taxTotal: z.number(),
    discountTotal: z.number(),
    grandTotal: z.number(),
    issuedAt: z.date().nullable(),
    dueAt: z.date().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    acquisition: z.unknown().nullable(),
    customer: z.unknown().nullable(),
    order: z.unknown().nullable(),
    serviceReq: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    items: z.array(z.unknown()),
    payments: z.array(z.unknown())
}).strict();

export type InvoiceResultType = z.infer<typeof InvoiceResultSchema>;
