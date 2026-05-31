import * as z from 'zod';

// prettier-ignore
export const PostTargetResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    platform: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    products: z.array(z.unknown())
}).strict();

export type PostTargetResultType = z.infer<typeof PostTargetResultSchema>;
