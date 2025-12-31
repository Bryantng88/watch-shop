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
    maintenanceRecordId: z.string().optional().nullable(),
    detail: ServiceDetailSchema,
    OrderItem: z.array(z.unknown()),
    maintenanceRecord: z.unknown().optional().nullable(),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type ServiceCatalogInputType = z.infer<typeof ServiceCatalogInputSchema>;
