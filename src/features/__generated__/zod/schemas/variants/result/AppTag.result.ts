import * as z from 'zod';

import { AppTagScopeSchema } from '../../enums/AppTagScope.schema';
import { AppTagOwnerTypeSchema } from '../../enums/AppTagOwnerType.schema';
// prettier-ignore
export const AppTagResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    color: z.string().nullable(),
    scope: AppTagScopeSchema,
    ownerType: AppTagOwnerTypeSchema.nullable(),
    ownerId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    links: z.array(z.unknown()),
    workflowTemplate: z.unknown().nullable(),
    workflowTemplateId: z.string().nullable()
}).strict();

export type AppTagResultType = z.infer<typeof AppTagResultSchema>;
