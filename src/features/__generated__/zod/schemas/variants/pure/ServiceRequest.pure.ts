import * as z from 'zod';

import { ServiceTypeSchema } from '../../enums/ServiceType.schema';
import { ServiceRequestStatusSchema } from '../../enums/ServiceRequestStatus.schema';
import { ServiceScopeSchema } from '../../enums/ServiceScope.schema';
// prettier-ignore
export const ServiceRequestModelSchema = z.object({
    id: z.string(),
    type: ServiceTypeSchema,
    billable: z.boolean(),
    orderItemId: z.string().nullable(),
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
    refNo: z.string().nullable(),
    scope: ServiceScopeSchema.nullable(),
    vendorId: z.string().nullable(),
    vendorNameSnap: z.string().nullable(),
    technicianId: z.string().nullable(),
    technicianNameSnap: z.string().nullable(),
    skuSnapshot: z.string().nullable(),
    primaryImageUrlSnapshot: z.string().nullable(),
    dummy_technical_rel: z.string().nullable(),
    priority: z.string().nullable(),
    priority_reason: z.string().nullable(),
    priority_source: z.string().nullable(),
    priority_marked_at: z.date().nullable(),
    priorityReason: z.string().nullable(),
    prioritySource: z.string().nullable(),
    priorityMarkedAt: z.date().nullable(),
    invoice: z.array(z.unknown()),
    maintenanceRecord: z.array(z.unknown()),
    customer: z.unknown().nullable(),
    OrderItem: z.unknown().nullable(),
    product: z.unknown().nullable(),
    user: z.unknown().nullable(),
    productVariant: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    serviceCatalog: z.unknown().nullable(),
    technicalAssessment: z.unknown().nullable(),
    technicalIssue: z.array(z.unknown())
}).strict();

export type ServiceRequestPureType = z.infer<typeof ServiceRequestModelSchema>;
