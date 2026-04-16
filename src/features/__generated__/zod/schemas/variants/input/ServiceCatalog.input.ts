import * as z from 'zod';

import { ServiceDetailSchema } from '../../enums/ServiceDetail.schema';
// prettier-ignore
export const ServiceCatalogInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    defaultPrice: z.number().optional().nullable(),
    durationMin: z.number().int().optional().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    detail: ServiceDetailSchema,
    vendorPrice: z.number().optional().nullable(),
    customerPrice: z.number().optional().nullable(),
    internalCost: z.number().optional().nullable(),
    note: z.string().optional().nullable(),
    categoryKey: z.string().optional().nullable(),
    sortOrder: z.number().int(),
    MaintenanceRecord: z.array(z.unknown()),
    OrderItem: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown()),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type ServiceCatalogInputType = z.infer<typeof ServiceCatalogInputSchema>;
