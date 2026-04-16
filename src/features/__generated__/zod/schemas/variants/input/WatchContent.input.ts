import * as z from 'zod';

// prettier-ignore
export const WatchContentInputSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    titleOverride: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
    hookText: z.string().optional().nullable(),
    body: z.string().optional().nullable(),
    bulletSpecs: z.array(z.string()),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    aiMetaJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchContentInputType = z.infer<typeof WatchContentInputSchema>;
