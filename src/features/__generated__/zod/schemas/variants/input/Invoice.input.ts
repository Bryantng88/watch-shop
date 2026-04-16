import * as z from 'zod';

import { InvoiceTypeSchema } from '../../enums/InvoiceType.schema';
import { InvoiceStatusSchema } from '../../enums/InvoiceStatus.schema';
// prettier-ignore
export const InvoiceInputSchema = z.object({
    id: z.string(),
    code: z.string().optional().nullable(),
    type: InvoiceTypeSchema,
    status: InvoiceStatusSchema,
    customerId: z.string().optional().nullable(),
    vendorId: z.string().optional().nullable(),
    orderId: z.string().optional().nullable(),
    acquisitionId: z.string().optional().nullable(),
    serviceRequestId: z.string().optional().nullable(),
    currency: z.string(),
    subTotal: z.number(),
    taxTotal: z.number(),
    discountTotal: z.number(),
    grandTotal: z.number(),
    issuedAt: z.date().optional().nullable(),
    dueAt: z.date().optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    Acquisition: z.unknown().optional().nullable(),
    Customer: z.unknown().optional().nullable(),
    Order: z.unknown().optional().nullable(),
    ServiceRequest: z.unknown().optional().nullable(),
    Vendor: z.unknown().optional().nullable(),
    InvoiceItem: z.array(z.unknown())
}).strict();

export type InvoiceInputType = z.infer<typeof InvoiceInputSchema>;
