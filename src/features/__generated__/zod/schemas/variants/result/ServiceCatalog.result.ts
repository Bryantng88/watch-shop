import * as z from 'zod';

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
    maintenanceRecord: z.unknown().nullable()
}).strict();

export type ServiceCatalogResultType = z.infer<typeof ServiceCatalogResultSchema>;
