import * as z from 'zod';

// prettier-ignore
export const ComplicationResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    watchSpecs: z.array(z.unknown())
}).strict();

export type ComplicationResultType = z.infer<typeof ComplicationResultSchema>;
