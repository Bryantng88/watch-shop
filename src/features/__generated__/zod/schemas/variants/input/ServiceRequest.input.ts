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
    technicianId: z.string().optional().nullable(),
    technicianNameSnap: z.string().optional().nullable(),
    skuSnapshot: z.string().optional().nullable(),
    primaryImageUrlSnapshot: z.string().optional().nullable(),
    dummy_technical_rel: z.string().optional().nullable(),
    priority: z.string().optional().nullable(),
    priority_reason: z.string().optional().nullable(),
    priority_source: z.string().optional().nullable(),
    priority_marked_at: z.date().optional().nullable(),
    priorityReason: z.string().optional().nullable(),
    prioritySource: z.string().optional().nullable(),
    priorityMarkedAt: z.date().optional().nullable(),
    invoice: z.array(z.unknown()),
    maintenance: z.array(z.unknown()),
    customer: z.unknown().optional().nullable(),
    orderItem: z.unknown().optional().nullable(),
    product: z.unknown().optional().nullable(),
    user: z.unknown().optional().nullable(),
    variant: z.unknown().optional().nullable(),
    vendor: z.unknown().optional().nullable(),
    serviceCatalog: z.unknown().optional().nullable(),
    technicalAssessment: z.unknown().optional().nullable(),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type ServiceRequestInputType = z.infer<typeof ServiceRequestInputSchema>;
