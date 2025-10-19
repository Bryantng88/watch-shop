import * as z from 'zod';

// prettier-ignore
export const MaintenancePartModelSchema = z.object({
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

export type MaintenancePartPureType = z.infer<typeof MaintenancePartModelSchema>;
