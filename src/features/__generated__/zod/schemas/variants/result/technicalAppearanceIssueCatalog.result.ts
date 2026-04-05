import * as z from 'zod';

// prettier-ignore
export const technicalAppearanceIssueCatalogResultSchema = z.object({
    id: z.string(),
    code: z.string(),
    area: z.string(),
    label: z.string(),
    deductionScore: z.number().int(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    note: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type technicalAppearanceIssueCatalogResultType = z.infer<typeof technicalAppearanceIssueCatalogResultSchema>;
