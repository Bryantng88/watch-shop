import * as z from 'zod';

import { StrapCatalogOptionKindSchema } from '../../enums/StrapCatalogOptionKind.schema';
// prettier-ignore
export const StrapCatalogOptionInputSchema = z.object({
    id: z.string(),
    kind: StrapCatalogOptionKindSchema,
    code: z.string(),
    name: z.string(),
    colorHex: z.string().optional().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type StrapCatalogOptionInputType = z.infer<typeof StrapCatalogOptionInputSchema>;
