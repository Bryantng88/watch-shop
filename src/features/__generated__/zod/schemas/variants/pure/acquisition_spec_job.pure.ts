import * as z from 'zod';

// prettier-ignore
export const acquisition_spec_jobModelSchema = z.object({
    id: z.string(),
    acquisition_item_id: z.string(),
    product_id: z.string(),
    status: z.string(),
    attempts: z.number().int(),
    last_error: z.string().nullable(),
    priority: z.number().int(),
    run_after: z.date(),
    started_at: z.date().nullable(),
    finished_at: z.date().nullable(),
    created_at: z.date(),
    updated_at: z.date()
}).strict();

export type acquisition_spec_jobPureType = z.infer<typeof acquisition_spec_jobModelSchema>;
