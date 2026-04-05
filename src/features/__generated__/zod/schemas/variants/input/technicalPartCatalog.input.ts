import * as z from 'zod';

// prettier-ignore
export const technicalPartCatalogInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    appliesTo: z.string(),
    partGroup: z.string(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type technicalPartCatalogInputType = z.infer<typeof technicalPartCatalogInputSchema>;
