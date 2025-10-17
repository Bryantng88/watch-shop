import * as z from 'zod';

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
    MaintenanceRecord: z.unknown().optional().nullable()
}).strict();

export type ServiceCatalogInputType = z.infer<typeof ServiceCatalogInputSchema>;
