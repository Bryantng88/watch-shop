import * as z from 'zod';

import { ServiceTypeSchema } from '../../enums/ServiceType.schema';
// prettier-ignore
export const MaintenanceRecordModelSchema = z.object({
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
    parts: z.array(z.unknown()),
    product: z.unknown().nullable(),
    serviceRequest: z.unknown().nullable(),
    variant: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    serviceDetail: z.array(z.unknown())
}).strict();

export type MaintenanceRecordPureType = z.infer<typeof MaintenanceRecordModelSchema>;
