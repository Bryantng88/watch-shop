import * as z from 'zod';

// prettier-ignore
export const system_job_run_logModelSchema = z.object({
    id: z.string(),
    processor_key: z.string(),
    trigger_source: z.string(),
    status: z.string(),
    processed_count: z.number().int(),
    error_count: z.number().int(),
    note: z.string().nullable(),
    detail: z.unknown().nullable(),
    started_at: z.date(),
    finished_at: z.date().nullable()
}).strict();

export type system_job_run_logPureType = z.infer<typeof system_job_run_logModelSchema>;
