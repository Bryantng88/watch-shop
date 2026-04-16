import * as z from 'zod';

// prettier-ignore
export const system_job_controlInputSchema = z.object({
    key: z.string(),
    label: z.string(),
    enabled: z.boolean(),
    batch_size: z.number().int(),
    paused_reason: z.string().optional().nullable(),
    metadata: z.unknown().optional().nullable(),
    updated_at: z.date(),
    updated_by: z.string().optional().nullable()
}).strict();

export type system_job_controlInputType = z.infer<typeof system_job_controlInputSchema>;
