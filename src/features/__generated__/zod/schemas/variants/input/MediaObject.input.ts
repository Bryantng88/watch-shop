import * as z from 'zod';

import { MediaObjectAvailabilitySchema } from '../../enums/MediaObjectAvailability.schema';
// prettier-ignore
export const MediaObjectInputSchema = z.object({
    id: z.string(),
    bucket: z.string(),
    storageKey: z.string(),
    originalFileName: z.string().optional().nullable(),
    mimeType: z.string().optional().nullable(),
    sizeBytes: z.bigint().optional().nullable(),
    checksum: z.string().optional().nullable(),
    etag: z.string().optional().nullable(),
    availability: MediaObjectAvailabilitySchema,
    verifiedAt: z.date().optional().nullable(),
    missingAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    bindings: z.array(z.unknown()),
    operations: z.array(z.unknown())
}).strict();

export type MediaObjectInputType = z.infer<typeof MediaObjectInputSchema>;
