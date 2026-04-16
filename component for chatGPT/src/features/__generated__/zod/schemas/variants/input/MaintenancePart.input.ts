import * as z from 'zod';

// prettier-ignore
export const MaintenancePartInputSchema = z.object({
    id: z.string(),
    recordId: z.string(),
    variantId: z.string().optional().nullable(),
    name: z.string(),
    quantity: z.number().int(),
    unitCost: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
    record: z.unknown(),
    variant: z.unknown().optional().nullable()
}).strict();

export type MaintenancePartInputType = z.infer<typeof MaintenancePartInputSchema>;
