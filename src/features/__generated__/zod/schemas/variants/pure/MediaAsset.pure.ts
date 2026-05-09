import * as z from 'zod';

import { MediaAssetStatusSchema } from '../../enums/MediaAssetStatus.schema';
import { ImageRoleSchema } from '../../enums/ImageRole.schema';
// prettier-ignore
export const MediaAssetModelSchema = z.object({
    id: z.string(),
    key: z.string(),
    parentPrefix: z.string(),
    fileName: z.string(),
    ext: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    etag: z.string().nullable(),
    lastModified: z.date().nullable(),
    profile: z.string().nullable(),
    status: MediaAssetStatusSchema,
    productId: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    role: ImageRoleSchema.nullable(),
    sortOrder: z.number().int(),
    isMissing: z.boolean(),
    missingAt: z.date().nullable(),
    lastSeenAt: z.date().nullable(),
    movedFromKey: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type MediaAssetPureType = z.infer<typeof MediaAssetModelSchema>;
