import * as z from 'zod';

import { StrapCatalogOptionKindSchema } from '../../enums/StrapCatalogOptionKind.schema';
// prettier-ignore
export const StrapCatalogOptionResultSchema = z.object({
    id: z.string(),
    kind: StrapCatalogOptionKindSchema,
    code: z.string(),
    name: z.string(),
    colorHex: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type StrapCatalogOptionResultType = z.infer<typeof StrapCatalogOptionResultSchema>;
