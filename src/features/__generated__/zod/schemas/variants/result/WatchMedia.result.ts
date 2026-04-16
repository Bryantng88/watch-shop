import * as z from 'zod';

import { ImageRoleSchema } from '../../enums/ImageRole.schema';
// prettier-ignore
export const WatchMediaResultSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    legacyProductImageId: z.string().nullable(),
    key: z.string().nullable(),
    url: z.string().nullable(),
    type: z.string().nullable(),
    role: ImageRoleSchema.nullable(),
    sortOrder: z.number().int(),
    alt: z.string().nullable(),
    width: z.number().int().nullable(),
    height: z.number().int().nullable(),
    mime: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    dominantHex: z.string().nullable(),
    contentHash: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchMediaResultType = z.infer<typeof WatchMediaResultSchema>;
