import * as z from 'zod';

import { ServiceTypeSchema } from '../../enums/ServiceType.schema';
import { ServiceRequestStatusSchema } from '../../enums/ServiceRequestStatus.schema';
import { ServiceScopeSchema } from '../../enums/ServiceScope.schema';
// prettier-ignore
export const ServiceRequestInputSchema = z.object({
    id: z.string(),
    type: ServiceTypeSchema,
    billable: z.boolean(),
    orderItemId: z.string().optional().nullable(),
    customerId: z.string().optional().nullable(),
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    brandSnapshot: z.string().optional().nullable(),
    modelSnapshot: z.string().optional().nullable(),
    refSnapshot: z.string().optional().nullable(),
    serialSnapshot: z.string().optional().nullable(),
    appointmentAt: z.date().optional().nullable(),
    status: ServiceRequestStatusSchema,
    notes: z.string().optional().nullable(),
    warrantyUntil: z.date().optional().nullable(),
    warrantyPolicy: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    servicecatalogid: z.string().optional().nullable(),
    refNo: z.string().optional().nullable(),
    scope: ServiceScopeSchema.optional().nullable(),
    vendorId: z.string().optional().nullable(),
    vendorNameSnap: z.string().optional().nullable(),
    Invoice: z.array(z.unknown()),
    maintenance: z.array(z.unknown()),
    customer: z.unknown().optional().nullable(),
    orderItem: z.unknown().optional().nullable(),
    product: z.unknown().optional().nullable(),
    variant: z.unknown().optional().nullable(),
    Vendor: z.unknown().optional().nullable(),
    ServiceCatalog: z.unknown().optional().nullable()
}).strict();

export type ServiceRequestInputType = z.infer<typeof ServiceRequestInputSchema>;
