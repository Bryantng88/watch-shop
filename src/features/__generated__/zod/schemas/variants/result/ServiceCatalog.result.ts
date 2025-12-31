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
    maintenanceRecordId: z.string().nullable(),
    detail: ServiceDetailSchema,
    OrderItem: z.array(z.unknown()),
    maintenanceRecord: z.unknown().nullable(),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type ServiceCatalogResultType = z.infer<typeof ServiceCatalogResultSchema>;
