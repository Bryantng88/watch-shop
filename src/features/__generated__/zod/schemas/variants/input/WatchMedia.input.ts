import * as z from 'zod';

import { ImageRoleSchema } from '../../enums/ImageRole.schema';
// prettier-ignore
export const WatchMediaInputSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    legacyProductImageId: z.string().optional().nullable(),
    key: z.string().optional().nullable(),
    url: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    role: ImageRoleSchema.optional().nullable(),
    sortOrder: z.number().int(),
    alt: z.string().optional().nullable(),
    width: z.number().int().optional().nullable(),
    height: z.number().int().optional().nullable(),
    mime: z.string().optional().nullable(),
    sizeBytes: z.number().int().optional().nullable(),
    dominantHex: z.string().optional().nullable(),
    contentHash: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchMediaInputType = z.infer<typeof WatchMediaInputSchema>;
