import * as z from 'zod';

// prettier-ignore
export const SystemJobControlInputSchema = z.object({
    key: z.string(),
    label: z.string(),
    enabled: z.boolean(),
    batchSize: z.number().int(),
    pausedReason: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    updatedAt: z.date(),
    updatedBy: z.string().optional().nullable()
}).strict();

export type SystemJobControlInputType = z.infer<typeof SystemJobControlInputSchema>;
