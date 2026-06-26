import * as z from 'zod';

import { AppTagScopeSchema } from '../../enums/AppTagScope.schema';
import { AppTagOwnerTypeSchema } from '../../enums/AppTagOwnerType.schema';
// prettier-ignore
export const AppTagInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    color: z.string().optional().nullable(),
    scope: AppTagScopeSchema,
    ownerType: AppTagOwnerTypeSchema.optional().nullable(),
    ownerId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    links: z.array(z.unknown())
}).strict();

export type AppTagInputType = z.infer<typeof AppTagInputSchema>;
