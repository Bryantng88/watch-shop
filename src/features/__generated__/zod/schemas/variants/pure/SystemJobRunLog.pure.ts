import * as z from 'zod';

// prettier-ignore
export const SystemJobRunLogModelSchema = z.object({
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

export type SystemJobRunLogPureType = z.infer<typeof SystemJobRunLogModelSchema>;
