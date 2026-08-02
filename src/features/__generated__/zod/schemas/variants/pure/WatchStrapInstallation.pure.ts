import * as z from 'zod';

import { StrapOwnershipModeSchema } from '../../enums/StrapOwnershipMode.schema';
// prettier-ignore
export const WatchStrapInstallationModelSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    strapVariantId: z.string(),
    ownershipMode: StrapOwnershipModeSchema,
    installedFullLinks: z.number().int().nullable(),
    installedHalfLinks: z.number().int().nullable(),
    spareFullLinks: z.number().int().nullable(),
    spareHalfLinks: z.number().int().nullable(),
    endLinkCount: z.number().int().nullable(),
    wristSizeMM: z.number().int().nullable(),
    installedAt: z.date(),
    removedAt: z.date().nullable(),
    installedByUserId: z.string().nullable(),
    removedByUserId: z.string().nullable(),
    sourceOrderId: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    note: z.string().nullable(),
    watch: z.unknown(),
    strapVariant: z.unknown()
}).strict();

export type WatchStrapInstallationPureType = z.infer<typeof WatchStrapInstallationModelSchema>;
