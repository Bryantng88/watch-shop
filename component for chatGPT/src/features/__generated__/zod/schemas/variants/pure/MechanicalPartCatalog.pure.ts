import * as z from 'zod';

import { MechanicalPartGroupSchema } from '../../enums/MechanicalPartGroup.schema';
// prettier-ignore
export const MechanicalPartCatalogModelSchema = z.object({
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

export type MechanicalPartCatalogPureType = z.infer<typeof MechanicalPartCatalogModelSchema>;
