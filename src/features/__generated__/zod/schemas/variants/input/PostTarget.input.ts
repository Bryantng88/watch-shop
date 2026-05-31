import * as z from 'zod';

// prettier-ignore
export const PostTargetInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    platform: z.string().optional().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    products: z.array(z.unknown())
}).strict();

export type PostTargetInputType = z.infer<typeof PostTargetInputSchema>;
