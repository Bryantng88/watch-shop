import * as z from 'zod';

// prettier-ignore
export const WatchContentModelSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    titleOverride: z.string().nullable(),
    summary: z.string().nullable(),
    hookText: z.string().nullable(),
    body: z.string().nullable(),
    bulletSpecs: z.array(z.string()),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    aiMetaJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchContentPureType = z.infer<typeof WatchContentModelSchema>;
