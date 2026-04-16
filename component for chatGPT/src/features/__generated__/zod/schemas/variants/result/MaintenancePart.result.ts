import * as z from 'zod';

// prettier-ignore
export const MaintenancePartResultSchema = z.object({
    id: z.string(),
    recordId: z.string(),
    variantId: z.string().nullable(),
    name: z.string(),
    quantity: z.number().int(),
    unitCost: z.number().nullable(),
    notes: z.string().nullable(),
    record: z.unknown(),
    variant: z.unknown().nullable()
}).strict();

export type MaintenancePartResultType = z.infer<typeof MaintenancePartResultSchema>;
