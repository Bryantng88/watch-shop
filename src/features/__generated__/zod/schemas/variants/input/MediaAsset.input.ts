import * as z from 'zod';

// prettier-ignore
export const MediaAssetInputSchema = z.object({
    id: z.string(),
    key: z.string(),
    parentPrefix: z.string(),
    fileName: z.string(),
    ext: z.string().optional().nullable(),
    sizeBytes: z.number().int().optional().nullable(),
    etag: z.string().optional().nullable(),
    lastModified: z.date().optional().nullable(),
    profile: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type MediaAssetInputType = z.infer<typeof MediaAssetInputSchema>;
