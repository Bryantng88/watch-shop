import * as z from 'zod';

import { ContentStatusSchema } from '../../enums/ContentStatus.schema';
// prettier-ignore
export const WatchContentResultSchema = z.object({
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
    watch: z.unknown(),
    contentStatus: ContentStatusSchema,
    submittedAt: z.date().nullable(),
    submittedById: z.string().nullable(),
    reviewedAt: z.date().nullable(),
    reviewedById: z.string().nullable(),
    reviewNote: z.string().nullable(),
    hashTags: z.string().nullable(),
    publishedAt: z.date().nullable(),
    publishedById: z.string().nullable()
}).strict();

export type WatchContentResultType = z.infer<typeof WatchContentResultSchema>;
