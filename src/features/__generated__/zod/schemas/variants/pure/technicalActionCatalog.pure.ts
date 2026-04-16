import * as z from 'zod';

// prettier-ignore
export const technicalActionCatalogModelSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    appliesTo: z.string(),
    groupKey: z.string(),
    requiresPart: z.boolean(),
    defaultExecutionMode: z.string().nullable(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    note: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type technicalActionCatalogPureType = z.infer<typeof technicalActionCatalogModelSchema>;
