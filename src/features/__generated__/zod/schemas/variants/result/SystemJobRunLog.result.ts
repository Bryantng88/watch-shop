import * as z from 'zod';

// prettier-ignore
export const SystemJobRunLogResultSchema = z.object({
    id: z.string(),
    processorKey: z.string(),
    triggerSource: z.string(),
    status: z.string(),
    processedCount: z.number().int(),
    errorCount: z.number().int(),
    note: z.string().nullable(),
    detail: z.unknown().nullable(),
    startedAt: z.date(),
    finishedAt: z.date().nullable()
}).strict();

export type SystemJobRunLogResultType = z.infer<typeof SystemJobRunLogResultSchema>;
