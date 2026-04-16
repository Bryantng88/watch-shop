import * as z from 'zod';

// prettier-ignore
export const technicalActionCatalogInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    appliesTo: z.string(),
    groupKey: z.string(),
    requiresPart: z.boolean(),
    defaultExecutionMode: z.string().optional().nullable(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type technicalActionCatalogInputType = z.infer<typeof technicalActionCatalogInputSchema>;
