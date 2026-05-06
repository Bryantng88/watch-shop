import * as z from 'zod';

import { ContentStatusSchema } from '../../enums/ContentStatus.schema';
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
    watch: z.unknown(),
    contentStatus: ContentStatusSchema,
    submittedAt: z.date().optional().nullable(),
    submittedById: z.string().optional().nullable(),
    reviewedAt: z.date().optional().nullable(),
    reviewedById: z.string().optional().nullable(),
    reviewNote: z.string().optional().nullable(),
    hashTags: z.string().optional().nullable(),
    publishedAt: z.date().optional().nullable(),
    publishedById: z.string().optional().nullable()
}).strict();

export type WatchContentInputType = z.infer<typeof WatchContentInputSchema>;
