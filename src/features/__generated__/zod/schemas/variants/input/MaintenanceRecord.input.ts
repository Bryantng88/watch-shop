import * as z from 'zod';

import { ServiceTypeSchema } from '../../enums/ServiceType.schema';
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
    parts: z.array(z.unknown()),
    product: z.unknown().optional().nullable(),
    serviceRequest: z.unknown().optional().nullable(),
    variant: z.unknown().optional().nullable(),
    vendor: z.unknown().optional().nullable(),
    serviceDetail: z.array(z.unknown())
}).strict();

export type MaintenanceRecordInputType = z.infer<typeof MaintenanceRecordInputSchema>;
