import * as z from 'zod';

import { MediaAssetStatusSchema } from '../../enums/MediaAssetStatus.schema';
import { ImageRoleSchema } from '../../enums/ImageRole.schema';
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
    status: MediaAssetStatusSchema,
    productId: z.string().optional().nullable(),
    acquisitionId: z.string().optional().nullable(),
    role: ImageRoleSchema.optional().nullable(),
    sortOrder: z.number().int(),
    isMissing: z.boolean(),
    missingAt: z.date().optional().nullable(),
    lastSeenAt: z.date().optional().nullable(),
    movedFromKey: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type MediaAssetInputType = z.infer<typeof MediaAssetInputSchema>;
