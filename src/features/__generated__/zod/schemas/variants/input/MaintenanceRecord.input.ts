import * as z from 'zod';

import { ServiceTypeSchema } from '../../enums/ServiceType.schema';
import { MaintenanceEventTypeSchema } from '../../enums/MaintenanceEventType.schema';
// prettier-ignore
export const MaintenanceRecordInputSchema = z.object({
    id: z.string(),
    type: ServiceTypeSchema,
    billable: z.boolean(),
    serviceRequestId: z.string().optional().nullable(),
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    brandSnapshot: z.string().optional().nullable(),
    modelSnapshot: z.string().optional().nullable(),
    refSnapshot: z.string().optional().nullable(),
    serialSnapshot: z.string().optional().nullable(),
    vendorId: z.string().optional().nullable(),
    servicedByName: z.string().optional().nullable(),
    vendorName: z.string().optional().nullable(),
    servicedAt: z.date().optional().nullable(),
    notes: z.string().optional().nullable(),
    totalCost: z.number().optional().nullable(),
    billed: z.boolean(),
    invoiceId: z.string().optional().nullable(),
    revenueAmount: z.number().optional().nullable(),
    currency: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    eventType: MaintenanceEventTypeSchema,
    prevVendorId: z.string().optional().nullable(),
    prevVendorName: z.string().optional().nullable(),
    paymentId: z.string().optional().nullable(),
    paidAmount: z.number().optional().nullable(),
    paidAt: z.date().optional().nullable(),
    parts: z.array(z.unknown()),
    Payment: z.unknown().optional().nullable(),
    product: z.unknown().optional().nullable(),
    serviceRequest: z.unknown().optional().nullable(),
    variant: z.unknown().optional().nullable(),
    vendor: z.unknown().optional().nullable(),
    serviceDetail: z.array(z.unknown())
}).strict();

export type MaintenanceRecordInputType = z.infer<typeof MaintenanceRecordInputSchema>;
