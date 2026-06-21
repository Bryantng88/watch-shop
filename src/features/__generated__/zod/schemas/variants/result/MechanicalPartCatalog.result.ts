import * as z from 'zod';

import { MechanicalPartGroupSchema } from '../../enums/MechanicalPartGroup.schema';
// prettier-ignore
export const MechanicalPartCatalogResultSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    group: MechanicalPartGroupSchema,
    defaultCost: z.number().nullable(),
    note: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type MechanicalPartCatalogResultType = z.infer<typeof MechanicalPartCatalogResultSchema>;
