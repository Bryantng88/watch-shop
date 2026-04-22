import * as z from 'zod';

// prettier-ignore
export const SystemJobControlModelSchema = z.object({
    key: z.string(),
    label: z.string(),
    enabled: z.boolean(),
    batchSize: z.number().int(),
    pausedReason: z.string().nullable(),
    metadata: z.unknown().nullable(),
    updatedAt: z.date(),
    updatedBy: z.string().nullable()
}).strict();

export type SystemJobControlPureType = z.infer<typeof SystemJobControlModelSchema>;
