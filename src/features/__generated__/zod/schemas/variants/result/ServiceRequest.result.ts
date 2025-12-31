import * as z from 'zod';

import { ServiceTypeSchema } from '../../enums/ServiceType.schema';
import { ServiceRequestStatusSchema } from '../../enums/ServiceRequestStatus.schema';
// prettier-ignore
export const ServiceRequestResultSchema = z.object({
    id: z.string(),
    type: ServiceTypeSchema,
    billable: z.boolean(),
    orderItemId: z.string(),
    customerId: z.string().nullable(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    brandSnapshot: z.string().nullable(),
    modelSnapshot: z.string().nullable(),
    refSnapshot: z.string().nullable(),
    serialSnapshot: z.string().nullable(),
    appointmentAt: z.date().nullable(),
    status: ServiceRequestStatusSchema,
    notes: z.string().nullable(),
    warrantyUntil: z.date().nullable(),
    warrantyPolicy: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    servicecatalogid: z.string().nullable(),
    Invoice: z.array(z.unknown()),
    maintenance: z.array(z.unknown()),
    customer: z.unknown().nullable(),
    orderItem: z.unknown(),
    product: z.unknown().nullable(),
    variant: z.unknown().nullable(),
    ServiceCatalog: z.unknown().nullable()
}).strict();

export type ServiceRequestResultType = z.infer<typeof ServiceRequestResultSchema>;
