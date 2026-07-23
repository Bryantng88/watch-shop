import * as z from 'zod';

import { MediaObjectAvailabilitySchema } from '../../enums/MediaObjectAvailability.schema';
// prettier-ignore
export const MediaObjectResultSchema = z.object({
    id: z.string(),
    bucket: z.string(),
    storageKey: z.string(),
    originalFileName: z.string().nullable(),
    mimeType: z.string().nullable(),
    sizeBytes: z.bigint().nullable(),
    checksum: z.string().nullable(),
    etag: z.string().nullable(),
    availability: MediaObjectAvailabilitySchema,
    verifiedAt: z.date().nullable(),
    missingAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    bindings: z.array(z.unknown()),
    operations: z.array(z.unknown())
}).strict();

export type MediaObjectResultType = z.infer<typeof MediaObjectResultSchema>;
