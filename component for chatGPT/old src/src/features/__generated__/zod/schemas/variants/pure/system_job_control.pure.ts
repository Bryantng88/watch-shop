import * as z from 'zod';

// prettier-ignore
export const system_job_controlModelSchema = z.object({
    key: z.string(),
    label: z.string(),
    enabled: z.boolean(),
    batch_size: z.number().int(),
    paused_reason: z.string().nullable(),
    metadata: z.unknown().nullable(),
    updated_at: z.date(),
    updated_by: z.string().nullable()
}).strict();

export type system_job_controlPureType = z.infer<typeof system_job_controlModelSchema>;
