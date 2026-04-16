import * as z from 'zod';

// prettier-ignore
export const technicalAppearanceIssueCatalogInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    area: z.string(),
    label: z.string(),
    deductionScore: z.number().int(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type technicalAppearanceIssueCatalogInputType = z.infer<typeof technicalAppearanceIssueCatalogInputSchema>;
