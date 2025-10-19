import * as z from 'zod';

// prettier-ignore
export const ServiceCatalogModelSchema = z.object({
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
    MaintenanceRecord: z.unknown().nullable()
}).strict();

export type ServiceCatalogPureType = z.infer<typeof ServiceCatalogModelSchema>;
