import * as z from 'zod';

// prettier-ignore
export const SupplyCatalogInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    category: z.string(),
    unit: z.string().optional().nullable(),
    defaultCost: z.number().optional().nullable(),
    note: z.string().optional().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type SupplyCatalogInputType = z.infer<typeof SupplyCatalogInputSchema>;
