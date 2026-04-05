import * as z from 'zod';

import { ServiceDetailSchema } from '../../enums/ServiceDetail.schema';
// prettier-ignore
export const ServiceCatalogResultSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    defaultPrice: z.number().nullable(),
    durationMin: z.number().int().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    detail: ServiceDetailSchema,
    vendorPrice: z.number().nullable(),
    customerPrice: z.number().nullable(),
    internalCost: z.number().nullable(),
    note: z.string().nullable(),
    categoryKey: z.string().nullable(),
    sortOrder: z.number().int(),
    MaintenanceRecord: z.array(z.unknown()),
    OrderItem: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown()),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type ServiceCatalogResultType = z.infer<typeof ServiceCatalogResultSchema>;
