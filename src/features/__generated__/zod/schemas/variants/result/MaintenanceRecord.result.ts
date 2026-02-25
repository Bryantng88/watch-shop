import * as z from 'zod';

import { ServiceTypeSchema } from '../../enums/ServiceType.schema';
import { MaintenanceEventTypeSchema } from '../../enums/MaintenanceEventType.schema';
// prettier-ignore
export const MaintenanceRecordResultSchema = z.object({
    id: z.string(),
    type: ServiceTypeSchema,
    billable: z.boolean(),
    serviceRequestId: z.string().nullable(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    brandSnapshot: z.string().nullable(),
    modelSnapshot: z.string().nullable(),
    refSnapshot: z.string().nullable(),
    serialSnapshot: z.string().nullable(),
    vendorId: z.string().nullable(),
    servicedByName: z.string().nullable(),
    vendorName: z.string().nullable(),
    servicedAt: z.date().nullable(),
    notes: z.string().nullable(),
    totalCost: z.number().nullable(),
    billed: z.boolean(),
    invoiceId: z.string().nullable(),
    revenueAmount: z.number().nullable(),
    currency: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    eventType: MaintenanceEventTypeSchema,
    prevVendorId: z.string().nullable(),
    prevVendorName: z.string().nullable(),
    paymentId: z.string().nullable(),
    paidAmount: z.number().nullable(),
    paidAt: z.date().nullable(),
    parts: z.array(z.unknown()),
    Payment: z.unknown().nullable(),
    product: z.unknown().nullable(),
    serviceRequest: z.unknown().nullable(),
    variant: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    serviceDetail: z.array(z.unknown())
}).strict();

export type MaintenanceRecordResultType = z.infer<typeof MaintenanceRecordResultSchema>;
