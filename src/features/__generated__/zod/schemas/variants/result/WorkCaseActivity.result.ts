import * as z from 'zod';

// prettier-ignore
export const WorkCaseActivityResultSchema = z.object({
    id: z.string(),
    workCaseId: z.string(),
    actorId: z.string().nullable(),
    action: z.string(),
    note: z.string().nullable(),
    metadata: z.unknown().nullable(),
    createdAt: z.date(),
    workCase: z.unknown(),
    actor: z.unknown().nullable()
}).strict();

export type WorkCaseActivityResultType = z.infer<typeof WorkCaseActivityResultSchema>;
