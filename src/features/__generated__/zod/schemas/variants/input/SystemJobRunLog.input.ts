import * as z from 'zod';

// prettier-ignore
export const SystemJobRunLogInputSchema = z.object({
    id: z.string(),
    processorKey: z.string(),
    triggerSource: z.string(),
    status: z.string(),
    processedCount: z.number().int(),
    errorCount: z.number().int(),
    note: z.string().optional().nullable(),
    detail: z.unknown().optional().nullable(),
    startedAt: z.date(),
    finishedAt: z.date().optional().nullable()
}).strict();

export type SystemJobRunLogInputType = z.infer<typeof SystemJobRunLogInputSchema>;
