import * as z from 'zod';

// prettier-ignore
export const technicalPartCatalogModelSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    appliesTo: z.string(),
    partGroup: z.string(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    note: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type technicalPartCatalogPureType = z.infer<typeof technicalPartCatalogModelSchema>;
