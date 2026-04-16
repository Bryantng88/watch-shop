import * as z from 'zod';

// prettier-ignore
export const system_job_run_logInputSchema = z.object({
    id: z.string(),
    processor_key: z.string(),
    trigger_source: z.string(),
    status: z.string(),
    processed_count: z.number().int(),
    error_count: z.number().int(),
    note: z.string().optional().nullable(),
    detail: z.unknown().optional().nullable(),
    started_at: z.date(),
    finished_at: z.date().optional().nullable()
}).strict();

export type system_job_run_logInputType = z.infer<typeof system_job_run_logInputSchema>;
