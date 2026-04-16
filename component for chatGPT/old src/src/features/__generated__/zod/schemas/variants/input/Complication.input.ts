import * as z from 'zod';

// prettier-ignore
export const ComplicationInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    watchSpecs: z.array(z.unknown())
}).strict();

export type ComplicationInputType = z.infer<typeof ComplicationInputSchema>;
