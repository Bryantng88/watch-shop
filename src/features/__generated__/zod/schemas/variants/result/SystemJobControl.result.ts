import * as z from 'zod';

// prettier-ignore
export const SystemJobControlResultSchema = z.object({
    key: z.string(),
    label: z.string(),
    enabled: z.boolean(),
    batchSize: z.number().int(),
    pausedReason: z.string().nullable(),
    metadata: z.unknown().nullable(),
    updated_at: z.date(),
    updated_by: z.string().nullable()
}).strict();

export type SystemJobControlResultType = z.infer<typeof SystemJobControlResultSchema>;
