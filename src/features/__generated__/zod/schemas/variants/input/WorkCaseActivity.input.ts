import * as z from 'zod';

// prettier-ignore
export const WorkCaseActivityInputSchema = z.object({
    id: z.string(),
    workCaseId: z.string(),
    actorId: z.string().optional().nullable(),
    action: z.string(),
    note: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.date(),
    workCase: z.unknown(),
    actor: z.unknown().optional().nullable()
}).strict();

export type WorkCaseActivityInputType = z.infer<typeof WorkCaseActivityInputSchema>;
