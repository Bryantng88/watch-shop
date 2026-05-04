import * as z from 'zod';

// prettier-ignore
export const MediaAssetResultSchema = z.object({
    id: z.string(),
    key: z.string(),
    parentPrefix: z.string(),
    fileName: z.string(),
    ext: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    etag: z.string().nullable(),
    lastModified: z.date().nullable(),
    profile: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type MediaAssetResultType = z.infer<typeof MediaAssetResultSchema>;
