import * as z from 'zod';

// prettier-ignore
export const SupplyCatalogModelSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    category: z.string(),
    unit: z.string().nullable(),
    defaultCost: z.number().nullable(),
    note: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type SupplyCatalogPureType = z.infer<typeof SupplyCatalogModelSchema>;
