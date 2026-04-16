import * as z from 'zod';

// prettier-ignore
export const ComplicationModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    watchSpecs: z.array(z.unknown())
}).strict();

export type ComplicationPureType = z.infer<typeof ComplicationModelSchema>;
