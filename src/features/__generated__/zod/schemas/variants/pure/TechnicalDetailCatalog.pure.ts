import * as z from 'zod';

// prettier-ignore
export const TechnicalDetailCatalogModelSchema = z.object({
    id: z.string(),
    area: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    technicalIssues: z.array(z.unknown()),
    taskAction: z.array(z.unknown())
}).strict();

export type TechnicalDetailCatalogPureType = z.infer<typeof TechnicalDetailCatalogModelSchema>;
