import * as z from 'zod';

import { AppTagTargetTypeSchema } from '../../enums/AppTagTargetType.schema';
// prettier-ignore
export const AppTagLinkResultSchema = z.object({
    id: z.string(),
    tagId: z.string(),
    targetType: AppTagTargetTypeSchema,
    targetId: z.string(),
    createdAt: z.date(),
    tag: z.unknown()
}).strict();

export type AppTagLinkResultType = z.infer<typeof AppTagLinkResultSchema>;
